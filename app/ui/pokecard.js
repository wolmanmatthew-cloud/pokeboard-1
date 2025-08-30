"use client"
import './pokecard.css'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default function PokeCard({ data }) {
    const [pokemonInfo, setPokemonInfo] = useState({})
    const [showTypes, setShowTypes] = useState(false)
    const [showAbilities, setShowAbilities] = useState(false)

    useEffect(() => {
        axios.get(data.url)
            .then((result) => {
                setPokemonInfo(result.data)
                console.log(result.data)
            })
            .catch((error) => console.log(error))
    }, [data])

    return (
        <div className="rounded-xl shadow-lg pokecard">
            <div className="flex justify-center align-center text-2xl">{data.name}</div>
            <div className="flex justify-center align-center"><img src={pokemonInfo.sprites && pokemonInfo.sprites.front_default}/></div>
            <div className="flex justify-center align-center">
                <div className="text-xl">Types</div>
                <div onClick={() => setShowTypes(!showTypes)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>
                </div>
            </div>
            <div className={`flex justify-center align-center ${showTypes ? "block" : "hidden"}`}>
                <ol>
                    {pokemonInfo.types && pokemonInfo.types.map((type => <li>{type.type.name}</li>))}
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