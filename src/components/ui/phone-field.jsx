'use client'

import * as React from 'react'
import { AsYouType, parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js'
import { motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { countryList, findCountry, DEFAULT_COUNTRY } from '@/lib/countries'
import { useMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Phone number entry with a country picker.
 *
 * The value in and out is a single E.164 string, which is what every caller
 * already stores: one `phone_number` column, printed straight onto the PDF and
 * unique across advisors. The split into country and national parts exists
 * only for the duration of typing.
 *
 * @param {object} props
 * @param {string} props.value              E.164, e.g. "+94771234567"
 * @param {(value: string) => void} props.onChange
 * @param {boolean} [props.invalid]
 */
export function PhoneField({
  value = '',
  onChange,
  invalid = false,
  disabled = false,
  id,
  className,
  ...props
}) {
  const [open, setOpen] = React.useState(false)
  const listboxId = React.useId()
  const m = useMotion()
  const countries = countryList()

  // Derived from `value` rather than mirrored in state, so a form reset or a
  // draft loaded from the server flows straight through.
  const parsed = React.useMemo(
    () => (value ? parsePhoneNumberFromString(value) : null),
    [value]
  )

  // A number saved before this field existed may be unparseable ("0771234567",
  // or blank). Falling back to the default country and showing the digits
  // as-is beats blanking data the customer already gave us.
  const [fallbackCountry, setFallbackCountry] = React.useState(DEFAULT_COUNTRY)
  const country = parsed?.country ?? fallbackCountry
  const selected = findCountry(country) ?? findCountry(DEFAULT_COUNTRY)

  const national = React.useMemo(() => {
    if (parsed) return parsed.formatNational()
    if (!value) return ''
    // Unparseable: strip the dial code if it happens to be there, keep the rest.
    const dial = selected?.dialCode ?? ''
    return value.startsWith(dial) ? value.slice(dial.length) : value
  }, [parsed, value, selected])

  const emit = React.useCallback(
    (iso, nationalInput) => {
      const digits = String(nationalInput).replace(/[^\d]/g, '')
      onChange?.(digits ? `+${getCountryCallingCode(iso)}${digits}` : '')
    },
    [onChange]
  )

  const handleNationalChange = (event) => {
    emit(country, event.target.value)
  }

  const handleCountrySelect = (iso) => {
    setFallbackCountry(iso)
    setOpen(false)
    // Keep whatever digits are typed and re-home them on the new dial code.
    emit(iso, national)
  }

  return (
    <div
      className={cn(
        'flex h-11 w-full overflow-hidden rounded-lg border border-border bg-surface-sunken',
        'transition-[color,background-color,border-color,box-shadow] duration-200 ease-[var(--ease-out-expo)]',
        'focus-within:border-primary-300 focus-within:bg-surface-raised focus-within:ring-ring/40 focus-within:ring-[3px]',
        invalid && 'border-destructive ring-destructive/20 ring-[3px]',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-label={`Country code: ${selected?.name ?? ''}`}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 border-r border-border px-3 text-sm outline-none hover:bg-surface-hover"
          >
            <span aria-hidden="true" className="text-base leading-none">
              {selected?.flag}
            </span>
            <span className="tabular-figures text-muted-foreground">
              {selected?.dialCode}
            </span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: m.duration(0.2), ease: [0.16, 1, 0.3, 1] }}
              className="text-muted-foreground"
            >
              <ChevronDown className="size-3.5" />
            </motion.span>
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" sideOffset={8} className="w-[19rem] p-0">
          {/* 245 countries needs search. cmdk was already a dependency and
              until now nothing imported it. */}
          <Command
            filter={(itemValue, search) =>
              itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
            }
          >
            <CommandInput placeholder="Search country…" />
            <CommandList id={listboxId}>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((item) => (
                  <CommandItem
                    key={item.iso}
                    // Searchable by name, ISO code and dial code alike.
                    value={`${item.name} ${item.iso} ${item.dialCode}`}
                    onSelect={() => handleCountrySelect(item.iso)}
                  >
                    <span aria-hidden="true" className="text-base leading-none">
                      {item.flag}
                    </span>
                    <span className="flex-1 truncate">{item.name}</span>
                    <span className="tabular-figures text-muted-foreground">
                      {item.dialCode}
                    </span>
                    {item.iso === country && <Check className="size-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        // AsYouType groups the digits the way the selected country writes them,
        // so the field reads like a phone number while it is being typed.
        value={national ? new AsYouType(country).input(national) : ''}
        onChange={handleNationalChange}
        placeholder={selected?.iso === 'LK' ? '77 123 4567' : 'Phone number'}
        className="h-full w-full min-w-0 bg-transparent px-3 text-base text-foreground outline-none placeholder:text-sm placeholder:text-muted-foreground/80 md:text-sm"
        {...props}
      />
    </div>
  )
}

export default PhoneField
