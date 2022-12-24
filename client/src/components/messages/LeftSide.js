import React, { useState } from "react";

const LeftSide = () => {
	const [search, setSearch] = useState("");
	const handleSearch = (e)=>{
		e.preventDafault();
	}
	return (
		<>
			<form className="message_header" onSubmit={handleSearch} >
				<input type="text" value={search}
					placeholder="Enter to Search..."
					onChange={e => setSearch(e.target.value)} />

				<button type="submit" style={{ display: 'none' }}>Search</button>
			</form>
			<div className="message_chat_list"></div>
		</>
	)
}

export default LeftSide;