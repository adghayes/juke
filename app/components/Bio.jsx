const maxLength = 160

function Bio({ bio, inputDispatch }){

    return (
        <label className="flex flex-col">
            <span className="inline-flex items-center py-1 font-medium">
                Bio
            </span>
            <textarea name="bio" value={bio} cols="30" rows="6" placeholder="Tell listeners a little about yourself..."
                className={"resize-none border border-gray-500 px-2 py-1 hover:bg-white bg-gray-100 rounded-xl " + 
                    "text-xs focus:outline-none focus:border-black focus:bg-white mx-1"}
                onChange={e => inputDispatch({'bio': e.target.value})} 
                maxLength={maxLength}/>
            <span className="self-end text-xs">
                {bio.length}/{maxLength}
            </span>
        </label>
    )
}

export default Bio