import React from 'react'

const Nmap = () => {
    const codeString = `<table className="border-collapse border border-gray-600 w-full max-w-2xl">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-600 px-4 py-2">Imię</th>
              <th className="border border-gray-600 px-4 py-2">Nazwisko</th>
              <th className="border border-gray-600 px-4 py-2">Wiek</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-900">
              <td className="border border-gray-600 px-4 py-2">Anna</td>
              <td className="border border-gray-600 px-4 py-2">Kowalska</td>
              <td className="border border-gray-600 px-4 py-2">28</td>
            </tr>
            <tr className="hover:bg-gray-900">
              <td className="border border-gray-600 px-4 py-2">Jan</td>
              <td className="border border-gray-600 px-4 py-2">Nowak</td>
              <td className="border border-gray-600 px-4 py-2">35</td>
            </tr>
          </tbody>
        </table>`;
    
    const codeString2 = `<pre className="bg-gray-900 p-4 rounded overflow-x-auto text-left w-full max-w-4xl">
          <code className="text-green-400 text-sm">
            {codeString}
          </code>
        </pre>`

  return (
    <div className="bg-black text-white box-border m-0 p-0">
      <div className="w-full bg-black flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 pt-20 md:pt-24 text-center">
      <h1>Jak zrobić tabelkę</h1>
        <table className="border-collapse border border-gray-600 w-full max-w-2xl">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-600 px-4 py-2">Imię</th>
              <th className="border border-gray-600 px-4 py-2">Nazwisko</th>
              <th className="border border-gray-600 px-4 py-2">Wiek</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-900">
              <td className="border border-gray-600 px-4 py-2">Anna</td>
              <td className="border border-gray-600 px-4 py-2">Kowalska</td>
              <td className="border border-gray-600 px-4 py-2">28</td>
            </tr>
            <tr className="hover:bg-gray-900">
              <td className="border border-gray-600 px-4 py-2">Jan</td>
              <td className="border border-gray-600 px-4 py-2">Nowak</td>
              <td className="border border-gray-600 px-4 py-2">35</td>
            </tr>
          </tbody>
        </table>

        <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-left w-full max-w-4xl">
          <code className="text-green-400 text-sm">
            {codeString}
          </code>
        </pre>
              <h1>Jak zrobić precode</h1>

        <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-left w-full max-w-4xl">
          <code className="text-green-400 text-sm">
            {codeString2}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default Nmap