"use client";

import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <SearchContext.Provider
            value={{
                isSearchOpen,
                setIsSearchOpen,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    return useContext(SearchContext);
}
