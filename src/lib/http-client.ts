import ky from "ky"

export const httpClient = ky.create({
  timeout: 15_000,
  retry: 0,
  headers: {
    accept: "application/json",
  },
})
