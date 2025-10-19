import React from "react"
import FormContainer from "@/components/FormContainer"
import FormNavButton from "@/components/FormNavButton"

export default function Form1Page() {
  return (
    <main className="min-h-screen bg-gray-100 flex justify-center pt-28 pb-10">
      <FormContainer>
        <p className="text-center text-gray-500 mb-6">
        </p>

        <div className="flex justify-between mt-110"> 
          <FormNavButton
            label="Back"
            type="prev"
            variant="gradient"
          />

          <FormNavButton
            label="Next"
            type="next"
            variant="gradient"
          />
        </div>
      </FormContainer>
    </main>
  )
}

