import React from "react";
import useHttp from "../hooks/useHttp.jsx";
import { BACKEND_URL } from "../util/constant.jsx";
import Error from "./Error.jsx";
import MealItem from "./MealItem.jsx";

const requestConfig = {};

export default function Meals() {
    const {
        data: loadedMeals,
        isLoading,
        error
    } = useHttp(`${BACKEND_URL}/meals`, requestConfig, []);

    if(isLoading) {
        return <p className="center">Fetching meals...</p>;
    }

    if(error) {
        return (
            <Error title='Failed to fetch meals.' message={error} />
        );
    }

    if(!loadedMeals.data) {
        return <p>No meals found.</p>;
    }

    return (
        <ul id="meals">
            {loadedMeals.data.map((meal) => (
                <MealItem key={meal.id} meal={meal} />
            ))}
        </ul>
    );
}