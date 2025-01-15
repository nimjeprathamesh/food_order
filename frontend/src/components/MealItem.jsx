import React, { useContext } from "react";
import CartContext from "../store/CartContext.jsx";
import { currencyFormatter } from "../util/formatting.jsx";
import Button from "./UI/Button.jsx";

export default function MealItem({meal}) {
    const cartCtx = useContext(CartContext);
    
    function handleAddMealToCart() {
        cartCtx.addItem(meal);
    }

    return (
        <li className="meal-item">
            <article>
                <img src={`https://food-order-app-eight-xi.vercel.app/${meal.image}`} alt={meal.name} />
                <div>
                    <h3>{meal.name}</h3>
                    <p className="meal-item-price">
                        {currencyFormatter.format(meal.price)}
                    </p>
                    <p className="meal-item-description">{meal.description}</p>
                </div>
                <p className="meal-item-actions">
                    <Button onClick={handleAddMealToCart}>Add to Cart</Button>
                </p>
            </article>
        </li>
    );
}