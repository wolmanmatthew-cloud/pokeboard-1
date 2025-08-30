"use client"
import axios from 'axios'
import { useState, useEffect } from 'react'
import PokeCard from '@/app/ui/pokecard'

export default function Home() {
  const [data, setData] = useState({ results: []})
  const [pageCount, setPageCount] = useState([])

  useEffect(() => {
  axios.get(`https://pokeapi.co/api/v2/pokemon/`)
      .then((response) => {
          setData(response.data)
          const pageCount = Math.floor(response.data.count/20)
          const pageNumbers = []
          for (let i = 0; i < pageCount; ++i) {
            pageNumbers.push(i+1)
          }
          setPageCount(pageNumbers)
        }
      )
      .catch((error) => {console.log(error)})
  }, [])
  
  function changePage(pageNumber: Number) {
    axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${(pageNumber * 20) - 20}`)
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => console.log(error))
  }
  

  return (
    <div>
      <div className="bg-red-500 flex justify-center align-center p-3">
        <h1 className="text-3xl text-white">PokeBoard</h1>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 p-2 gap-5 items-start">
        {data && data.results.map((result) => <PokeCard data={result}/>)}
      </div>
      <div className="flex flex-wrap">
        {pageCount && pageCount.map((pageNumber) => <div className="p-2"><button onClick={() => changePage(pageNumber)}>{pageNumber}</button></div>)}
      </div>
    </div>  
  );
}
