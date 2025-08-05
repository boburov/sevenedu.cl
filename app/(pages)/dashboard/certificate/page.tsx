"use client"
import { getMe } from "@/app/api/service/api"
import { useEffect } from "react"

const page = () => {
  useEffect(() => {
    getMe().then((user) => {
      console.log(user);
    })
  })
  return (
    <div>page</div>
  )
}

export default page