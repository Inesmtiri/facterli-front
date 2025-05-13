import { createContext, useState } from "react";

// Crée un contexte de recherche
export const SearchContext = createContext();

// Fournisseur du contexte
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState(""); // valeur tapée dans le champ

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};
