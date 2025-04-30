import { useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// TODO: Ajouter la gestion de l'heure selon la région du user
export const useDateFormatter = () => {
    const formatDate = useCallback((dateString: Date, dateFormat: string = "PPpp", locale = fr) => {
        const date = new Date(dateString);
        return format(date, dateFormat, { locale });
    }, []);

    return { formatDate };
};