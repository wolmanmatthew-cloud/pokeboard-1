"use client"
import './pokecard.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import typeObject from '../type-icons'
import Image from 'next/image'

export default function PokeCard({ data }) {
    const [pokemonInfo, setPokemonInfo] = useState({})
    const [showAbilities, setShowAbilities] = useState(false)

    useEffect(() => {
        axios.get(data.url)
            .then((result) => {
                setPokemonInfo(result.data)
            })
            .catch((error) => console.log(error))
    }, [data])

    return (
        <div className="rounded-xl shadow-lg pokecard">
            <div className="flex justify-center align-center text-2xl">{data.name}</div>
            <div className="flex justify-center align-center"><img src={pokemonInfo.sprites && pokemonInfo.sprites.front_default}/></div>
            {/* <div className="flex justify-center align-center">
                <div className="text-xl">Types</div>
                <div onClick={() => setShowTypes(!showTypes)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>
                </div>
            </div> */}
            <div className={`flex justify-center align-center`}>
                <ol className="flex">
                    {pokemonInfo.types && pokemonInfo.types.map((type => 
                        <li className="p-3">
                            <div className={`icon ${type.type.name}`}>
                                <Image src={typeObject[type.type.name]} title={`${type.type.name}`}/>
                            </div>
                            
                        </li>
                    ))}
                </ol>
            </div>
            <div className="flex justify-center align-center">
                <div className="text-xl">Abilities</div>
                <div onClick={() => setShowAbilities(!showAbilities)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>
                </div>
            </div>
            <div className={`flex justify-center align-center ${showAbilities ? "block" : "hidden"}`}>
                <ol>
                    {pokemonInfo.abilities && pokemonInfo.abilities.map((ability => <li>{ability.ability.name}</li>))}
                </ol>
            </div>
        </div>
    )
}