'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

import { apiClient } from '@/infrastructure/http/apiClient'
import { emptyDraft, toDraft } from '@/application/view-models/needAnalysisDraft'

const FormContext = createContext(undefined)

const STORAGE_KEY = 'needalyze-form-data'

/**
 * Holds the customer's in-progress form.
 *
 * Its job is now only draft state: what the customer has typed, what has been
 * saved, and what the server said. Deciding which columns a step writes, what a
 * completed form is, and what the life cover works out to all moved server-side
 * — this file used to own a copy of each.
 */
export function FormProvider({ children }) {
  const [formData, setFormData] = useState(emptyDraft)
  const [isLoaded, setIsLoaded] = useState(false)
  const [apiError, setApiError] = useState(null)
  const params = useParams()
  const linkId = params?.linkId || null

  useEffect(() => {
    if (!linkId) {
      setIsLoaded(true)
      return
    }

    let cancelled = false

    const load = async () => {
      try {
        const { analysis } = await apiClient.get(`/api/form/${linkId}`, {
          auth: false,
        })
        if (cancelled) return

        const draft = toDraft(analysis)
        setApiError(null)
        setFormData(draft)
        writeCache(draft)
      } catch (error) {
        if (cancelled) return

        setApiError({ status: error.status, message: error.message })

        // A network blip shouldn't lose what the customer already typed.
        const cached = readCache()
        if (cached) setFormData(cached)
      } finally {
        if (!cancelled) setIsLoaded(true)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [linkId])

  // Mirror the draft to localStorage so a refresh mid-form is not a data loss.
  useEffect(() => {
    if (isLoaded) writeCache(formData)
  }, [formData, isLoaded])

  /**
   * Update a step locally, optionally saving it first.
   *
   * @param {'step1'|'step2'|'step3'|'step4'} step
   * @param {Object} data
   * @param {boolean} [saveToDb]
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const updateStepData = async (step, data, saveToDb = false) => {
    setFormData((previous) => ({
      ...previous,
      [step]: { ...previous[step], ...data },
    }))

    if (!saveToDb || !linkId) return { success: true }

    try {
      const { analysis } = await apiClient.post(
        `/api/form/${linkId}`,
        { step, data },
        { auth: false }
      )

      // Adopt the two things the server owns: the computed life cover and the
      // completion status. Deliberately not the whole draft — the four step-3
      // inputs are not persisted, so a full overwrite would blank the numbers
      // the customer just typed.
      if (analysis) {
        const saved = toDraft(analysis)
        setFormData((previous) => ({
          ...previous,
          step3: {
            ...previous.step3,
            humanLifeValue: saved.step3.humanLifeValue,
          },
          step4: saved.step4,
        }))
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const getStepData = (step) => formData[step]

  const getAllData = () => formData

  /** Start the form over: clear the draft and put the saved form back to pending. */
  const resetForm = async () => {
    setFormData(emptyDraft())
    clearCache()

    if (!linkId) return { success: true }

    try {
      await apiClient.post(`/api/form/${linkId}/reset`, undefined, {
        auth: false,
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    formData,
    updateStepData,
    getStepData,
    getAllData,
    resetForm,
    isLoaded,
    linkId,
    apiError,
    clearApiError: () => setApiError(null),
  }

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export function useFormContext() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}

function writeCache(draft) {
  if (typeof window === 'undefined') return
  try {
    const serialisable = {
      ...draft,
      step1: {
        ...draft.step1,
        dateOfBirth:
          draft.step1?.dateOfBirth instanceof Date
            ? draft.step1.dateOfBirth.toISOString()
            : draft.step1?.dateOfBirth ?? null,
      },
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialisable))
  } catch (error) {
    console.error('Error saving form draft:', error)
  }
}

function readCache() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (parsed.step1?.dateOfBirth) {
      parsed.step1.dateOfBirth = new Date(parsed.step1.dateOfBirth)
    }
    return { ...emptyDraft(), ...parsed }
  } catch (error) {
    console.error('Error reading form draft:', error)
    return null
  }
}

function clearCache() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing form draft:', error)
  }
}
