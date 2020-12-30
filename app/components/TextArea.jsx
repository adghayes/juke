const maxLength = 160

function TextArea({ label, name, value, placeholder, inputDispatch }){

    return (
        <label className="flex flex-col">
            <span className="inline-flex items-center py-1 font-medium">
                {label}
            </span>
            <textarea name={name} value={value} cols="30" rows="6" placeholder={placeholder}
                className={"resize-none border border-gray-500 px-2 py-1 hover:bg-white bg-gray-100 rounded-xl " + 
                    "text-xs focus:outline-none focus:border-black focus:bg-white mx-1"}
                onChange={e => inputDispatch({[name]: e.target.value})} 
                maxLength={maxLength}/>
            <span className="self-end text-xs">
                {value.length}/{maxLength}
            </span>
        </label>
    )
}

export default TextArea