"use client"
import axios from 'axios'
import { useState, useEffect } from 'react'
import PokeCard from '@/app/ui/pokecard'

export default function Home() {
  const [data, setData] = useState({ results: []})
  const [pageCount, setPageCount] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [types, setTypes] = useState([])
  const [searchTypes, setSearchTypes] = useState([])

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
    axios.get(`https://pokeapi.co/api/v2/type`)
        .then((response) => {
          const proxyTypeHolder = []
          console.log(response)
          response.data.results.forEach((result) => proxyTypeHolder.push(result.name))

          setTypes(proxyTypeHolder)
        })
        .catch((error) => console.log(error))
  }, [])
  
  useEffect(() => {
    console.log(searchTypes)
  }, [searchTypes])

  useEffect(() => {
    console.log(pageNumber)
    if (pageNumber !== 0) {
    axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${(pageNumber * 20) - 20}`)
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => console.log(error))
    }
  }, [pageNumber])
  
  function searchByName(name) {
    if (name === '') {
      console.log('this ran')
      setPageNumber(1)
    } else {
      axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((response) => {
        setPageNumber(0)
        const proxyResponse = {
          data: {
            results: [{ name: name, url: `https://pokeapi.co/api/v2/pokemon/${name}`}]
          }
        }
        
        setData(proxyResponse.data)
      })
      .catch((error) => console.log('unknown pokemon name'))
    }
    
  }

  function updateSearchTypes(newType, e) {
    if (e.target.checked) {
      const proxy = [...searchTypes]
      proxy.push(newType)
      setSearchTypes(proxy)
    } else if (!e.target.checked) {
      const proxy = searchTypes.filter(type => type !== newType)
      setSearchTypes(proxy)
    }
  }

  function findDuplicatesWithSet(arr) {
    const seen = new Set();
    const duplicates = [];

    for (const item of arr) {
      if (seen.has(item)) {
        duplicates.push(item);
      } else {
        seen.add(item);
      }
    }
    return duplicates;
  }

  useEffect(() => {
    setPageNumber(0)
    if (searchTypes.length === 0) setPageNumber(1)
    const nameHolder = []
    searchTypes.forEach((type) => {
      axios.get(`https://pokeapi.co/api/v2/type/${type}`)
        .then((response) => {
          // console.log(response.data.pokemon)
          response.data.pokemon.forEach((pokemon) => {
            console.log(pokemon.pokemon.name)
            nameHolder.push(pokemon.pokemon.name)
          })
          let convertedToPokecardObject = []
          // console.log(nameHolder, 'hello?')
          if (searchTypes.length === 1) {
            convertedToPokecardObject = nameHolder.map((pokemonName) => ({ name: pokemonName, url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`}))
          } else if (searchTypes.length === 2) {
            const duplicatesFound = findDuplicatesWithSet(nameHolder)
            convertedToPokecardObject = duplicatesFound.map((pokemonName) => ({ name: pokemonName, url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`}))
          } else if (searchTypes.length > 2) {

          }

          
          console.log(convertedToPokecardObject)

          if (convertedToPokecardObject.length > 0) {
            setData({ results: convertedToPokecardObject })
          }
        })
    })
    
  }, [searchTypes])

  return (
    <div>
      <div className="bg-red-500 flex justify-center align-center p-3">
        <h1 className="text-3xl text-white">PokeBoard</h1>
      </div>
      <div className="flex flex-col justify-center items-center p-2">
        <h1 className="text-2xl text-blue-500 p-1">Search by Name</h1>
        <div className="p-1">
          <input type="text" onChange={(e) => searchByName(e.target.value)}/>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center p-2">
        <h1 className="text-2xl text-blue-500 p-1">Search by Type</h1>
        <div className="p-1">
          <div className="grid grid-cols-2 gap-3">
            {types && types.map((type) => 
              <div className="flex justify-center items-center">
                <input type="checkbox" onChange={(e) => updateSearchTypes(type, e)}/>{type}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 p-2 gap-5 items-start">
        {data && data.results.map((result) => <PokeCard data={result}/>)}
      </div>
      <div className="flex flex-wrap">
        {pageCount && pageCount.map((pageNumberFromUi) => <div onClick={() => setPageNumber(pageNumberFromUi)} className="p-3">{pageNumberFromUi}</div>)}
      </div>
      <div className="bg-blue-500 flex justify-center align-center p-2">
        <h1 className="text-xl text-white">Wolman Company Limited</h1>
      </div>
    </div>  
  );
}
