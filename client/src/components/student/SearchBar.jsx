import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ data }) => {

  const navigate = useNavigate()

  const [input, setInput] = useState(data ? data : '')

  const onSearchHandler = (e) => {
    e.preventDefault()
    if (input.trim()) {
      navigate('/course-list/' + input.trim())
    }
  }

  return (
    <form onSubmit={onSearchHandler} className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-center md:px-3 px-2">
        <img className="md:w-5 w-4" src={assets.search_icon} alt="search_icon" />
      </div>
      <input 
        onChange={e => setInput(e.target.value)} 
        value={input} 
        type="text" 
        className="flex-1 h-full outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base bg-transparent"
        placeholder="Search for courses, topics, or instructors..." 
      />
      <button 
        type='submit' 
        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold md:px-8 px-6 h-full transition-all duration-200"
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar