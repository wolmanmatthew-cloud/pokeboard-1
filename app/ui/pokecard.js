"use client"
import './pokecard.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import typeObject from '../type-icons'
import Image from 'next/image'

export default function PokeCard({ data }) {
    const [pokemonInfo, setPokemonInfo] = useState({})
    const [showAbilities, setShowAbilities] = useState(false)
    const [typeRelations, setTypeRelations] = useState({})
    const [showTypeRelations, setShowTypeRelations] = useState(false)

    useEffect(() => {
        axios.get(data.url)
            .then((result) => {
                setPokemonInfo(result.data)
            })
            .catch((error) => console.log(error))
    }, [data])

    useEffect(() => {
        const apiRequestArray = []
        pokemonInfo.types && pokemonInfo.types.forEach((type) => apiRequestArray.push(axios.get(type.type.url)))
        
        axios.all(apiRequestArray)
            .then(axios.spread((responseOne, responseTwo) => {
                const half_damage_from = []
                const double_damage_from = []
                const no_damage_from = []
                
                
                    responseOne && responseOne.data.damage_relations.double_damage_from.forEach((obj) => double_damage_from.push(obj.name))
                    responseTwo && responseTwo.data.damage_relations.double_damage_from.forEach((obj) => double_damage_from.push(obj.name))

                    responseOne && responseOne.data.damage_relations.half_damage_from.forEach((obj) => half_damage_from.push(obj.name))
                    responseTwo && responseTwo.data.damage_relations.half_damage_from.forEach((obj) => half_damage_from.push(obj.name))

                    responseOne && responseOne.data.damage_relations.no_damage_from.forEach((obj) => no_damage_from.push(obj.name))
                    responseTwo && responseTwo.data.damage_relations.no_damage_from.forEach((obj) => no_damage_from.push(obj.name))
                    
                    const proxyNoDamageDupes = no_damage_from.filter((val, i) => no_damage_from.indexOf(val) !== i)
                    const proxyNoDamageSingles = no_damage_from.filter((val, i) => proxyNoDamageDupes.indexOf(val) === -1)
                    const proxyNoDamage = [...proxyNoDamageDupes, ...proxyNoDamageSingles]

                    const superStrong = half_damage_from.filter((val, i) => half_damage_from.indexOf(val) !== i)
                    const proxyStrong = half_damage_from.filter((val) => superStrong.indexOf(val) === -1)
                    
                    const superWeak = double_damage_from.filter((val, i) => double_damage_from.indexOf(val) !== i)
                    const proxyWeak = double_damage_from.filter((val) => superWeak.indexOf(val) === -1)
                    
                    const strong = proxyStrong.filter((val, i) => proxyWeak.indexOf(val) === -1)
                    const weak = proxyWeak.filter((val, i) => proxyStrong.indexOf(val) === -1)
                
                

                superStrong.push(...proxyNoDamage)
                setTypeRelations({
                    superStrong,
                    strong,
                    weak,
                    superWeak
                })
                //console.log(`superStrong: ${superStrong}\n strong: ${strong}\n superWeak: ${superWeak}\n weak: ${weak}`)
            }))
            .catch(errors => {
                console.error('Error fetching data:', errors);
            });
    }, [pokemonInfo])

    return (
        <div className="rounded-xl shadow-lg pokecard">
            <div className="flex justify-center align-center text-2xl">{data.name}</div>
            <div className="flex justify-center align-center"><img src={pokemonInfo.sprites && pokemonInfo.sprites.front_default}/></div>
            {/* <div className="flex justify-center align-center">
                <div className="text-xl">Types</div>
                <div onClick={() => setShowTypes(!showTypes)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>
                </div>
            </div> */}
            <div className={`flex justify-center align-center`}>
                <ol className="flex">
                    {pokemonInfo.types && pokemonInfo.types.map((type => 
                        <li key={type.type.name} className="p-3">
                            <div className={`icon ${type.type.name}`}>
                                <Image src={typeObject[type.type.name]} title={`${type.type.name}`} alt={`${type.type.name}`}/>
                            </div>
                            
                        </li>
                    ))}
                </ol>
            </div>
            <div className="flex justify-center align-center">
                <div className="text-xl">Type Relations</div>
                <div onClick={() => setShowTypeRelations(!showTypeRelations)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>
                </div>
            </div>
            <div className={`${showTypeRelations ? "block" : "hidden"}`}>
                {typeRelations.superStrong && typeRelations.superStrong.length !== 0 ? 
                    <div> 
                        <div className="text-lg">Super Strong</div>
                        <div>
                            <ol className="flex flex-wrap">
                                {
                                    typeRelations.superStrong ? typeRelations.superStrong.map((type) => 
                                        <li className="p-3">
                                            <div className={`icon ${type}`}>
                                                <Image src={typeObject[type]} title={`${type}`} alt={`${type}`}/>
                                            </div>
                                        </li>
                                    ) : ''
                                }
                            </ol>
                        </div>
                    </div> : ''
                }
                {typeRelations.strong && typeRelations.strong.length !== 0 ? 
                    <div> 
                        <div className="text-lg">Strong</div>
                        <div>
                            <ol className="flex flex-wrap">
                                {
                                    typeRelations.strong ? typeRelations.strong.map((type) => 
                                        <li className="p-3">
                                            <div className={`icon ${type}`}>
                                                <Image src={typeObject[type]} title={`${type}`} alt={`${type}`}/>
                                            </div>
                                        </li>
                                    ) : ''
                                }
                            </ol>
                        </div>
                    </div> : ''
                }
                {typeRelations.weak && typeRelations.weak.length !== 0 ? 
                    <div> 
                        <div className="text-lg">Weak</div>
                        <div>
                            <ol className="flex flex-wrap">
                                {
                                    typeRelations.weak ? typeRelations.weak.map((type) => 
                                        <li className="p-3">
                                            <div className={`icon ${type}`}>
                                                <Image src={typeObject[type]} title={`${type}`} alt={`${type}`}/>
                                            </div>
                                        </li>
                                    ) : ''
                                }
                            </ol>
                        </div>
                    </div> : ''
                }
                {typeRelations.superWeak && typeRelations.superWeak.length !== 0 ? 
                    <div> 
                        <div className="text-lg">Super Weak</div>
                        <div>
                            <ol className="flex flex-wrap">
                                {
                                    typeRelations.superWeak ? typeRelations.superWeak.map((type) => 
                                        <li className="p-3">
                                            <div className={`icon ${type}`}>
                                                <Image src={typeObject[type]} title={`${type}`} alt={`${type}`}/>
                                            </div>
                                        </li>
                                    ) : ''
                                }
                            </ol>
                        </div>
                    </div> : ''
                }
            </div>
            <div className="flex justify-center align-center">
                <div className="text-xl">Abilities</div>
                <div onClick={() => setShowAbilities(!showAbilities)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
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