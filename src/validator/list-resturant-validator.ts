import { checkSchema } from 'express-validator'

export const listResturantValidator = checkSchema(
   {
      r: {
         trim: true,
         customSanitizer: {
            options: (value: unknown) => {
               return value ? value : ''
            },
         },
      },
      currentPage: {
         customSanitizer: {
            options: (value) => {
               const parsedValue = Number(value)
               return Number.isNaN(parsedValue) ? 1 : parsedValue
            },
         },
      },
      perPage: {
         customSanitizer: {
            options: (value) => {
               const parsedValue = Number(value)
               return Number.isNaN(parsedValue) ? '' : parsedValue
            },
         },
      },

   },
   
)
