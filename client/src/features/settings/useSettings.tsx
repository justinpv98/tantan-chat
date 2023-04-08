import { useContext } from "react";
import { SettingsContext } from "./settings.context";

export default function useSettings(){
    return useContext(SettingsContext);
}