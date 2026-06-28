import { useState, useCallback } from 'react'

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (touched[name] && validate) {
      const newErrors = validate({ ...values, [name]: value })
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }))
    }
  }, [values, touched, validate])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    if (validate) {
      const newErrors = validate(values)
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }))
    }
  }, [values, validate])

  const handleSubmit = useCallback((onSubmit) => (e) => {
    e.preventDefault()
    const allTouched = Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)

    if (validate) {
      const newErrors = validate(values)
      setErrors(newErrors)
      if (Object.keys(newErrors).length > 0) return
    }

    onSubmit(values)
  }, [values, validate])

  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setValues,
  }
}
