import React from 'react';
import "./menuItem.css";

function MenuItem({ name, description, img, onAdd }) {
    return (
        <div className="card">
            <img src={img} className="menu-img card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description}</p>
                <button type='button' className="btn btn-primary add-btn" onClick={onAdd}>
                    Add
                </button>
            </div>
        </div>
    );
}

export default MenuItem;
