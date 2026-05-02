import React, {useEffect, useState}from 'react';
import axios from "axios";

export default function MainPage() {
    //state for the form feilds
    const[date,setDate] = useState(null);
    const[sourceCurrency,setSourceCurrency] = useState("");
    const[targetCurrency,setTargetCurrency] = useState("");
    const[amountInSourceCurrency,setAmountInSourceCurrency] = useState(0);
    const[amountInTargetCurrency,setAmountInTargetCurrency] = useState(0);
    const [currencyNames, setCurrencyNames] = useState([]);

    //handle submit method
    const handleSubmit = async (e) =>{
        e.preventDefault();

        try{

            const response = await axios.get("http://localhost:5000/convert",{
                    params:{
                    date,
                    sourceCurrency,
                    targetCurrency,
                    amountInSourceCurrency
                 },
                });

                 setAmountInTargetCurrency(response.data);

        }catch(err){
            console.error(err);
        }
    };

//get all currency name 
useEffect(() => {
    const getCurrencyNames = async() =>{
        try{
            const response = await axios.get(
                "http://localhost:5000/getAllCurrencies"
            );
            setCurrencyNames(response.data);

        }catch(err){
            console.error(err);
        }
    };
    getCurrencyNames();
}, []);

  return (
    <div>
        <h1 className="lg:mx-32 text-4xl font-bold text-green-400">Convert Your Currency Today</h1>

        <p className='lg:mx-32 opacity-50 py-6'>Welcome to Convert Your Currency Today 🌍💱<br />
            Quickly and easily convert currencies with real-time exchange rates. Simple, fast, and reliable — start converting in seconds! ✨
            </p>

            <div className='mt-5 flex items-center justify-center flex-col'>
                <section className='w-full lg:w-1/2 bg-neutral-secondary-medium rounded-base p-6'>
                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">
                            <label htmlFor={date} 
                            className="block mb-2.5 text-sm font-medium text-heading">Date</label>
                            <input 
                            onChange={(e)=> setDate(e.target.value)}
                            type="Date"
                             id={date} 
                             name={date} 
                             className="bg-gray-700 focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs"
                             placeholder='mm/dd/yyyy' 
                              required />
                        </div>

                        <div className="mb-4">
                            <label htmlFor={sourceCurrency}
                            className="block mb-2.5 text-sm font-medium text-heading">Source Currency</label>
                            <select 
                            onChange={(e)=>setSourceCurrency(e.target.value)}
                            id={sourceCurrency}
                            name={sourceCurrency}
                            value={sourceCurrency}
                            className="block w-full px-3 py-2.5 bg-gray-700 focus:ring-brand focus:border-brand shadow-xs"
                            placeholder='Select source currency'>
                                <option value="">Select source currency</option>
                                    {Object.keys(currencyNames).map((currency)=>(
                                        <option className='p-1' key={currency} value={currency}>
                                            {currencyNames[currency]}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor={targetCurrency}
                            className="block mb-2.5 text-sm font-medium text-heading">Target Currency</label>
                            <select 
                            onChange={(e)=>setTargetCurrency(e.target.value)}
                            id={targetCurrency}
                            name={targetCurrency}
                            value={targetCurrency}
                            className="block w-full px-3 py-2.5 bg-gray-700 focus:ring-brand focus:border-brand shadow-xs"
                            placeholder='Select target Currency'>
                                <option value="">Select Target currency</option>
                                    {Object.keys(currencyNames).map((currency)=>(
                                        <option className='p-1' key={currency} value={currency}>
                                            {currencyNames[currency]}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor={amountInSourceCurrency}
                            className="block mb-2.5 text-sm font-medium text-heading">Amount in source currency</label>
                            <input
                            onChange={(e)=>setAmountInSourceCurrency(e.target.value)} 
                            type="number"
                             id={amountInSourceCurrency}
                             name={amountInSourceCurrency}
                             value={amountInSourceCurrency}
                             className="bg-gray-700 focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs"
                             placeholder='Amount in source currency' 
                              required />
                        </div>

                        <div>
                            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md">Get the Target Currency</button>
                        </div>

                    </form>
                </section>
            </div>
            {amountInTargetCurrency}
    </div>
  )
}
