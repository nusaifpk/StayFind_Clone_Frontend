import React from 'react'
import services from '../../assets/services'
import './Features.css'

const Features = () => {
    return (
        <div>
            <div className="services">
                {services.map((services => (
                    <div className='service_card' key={services.name}>
                        <div className="card_container">
                            <img src={services.icon} alt="" />
                        </div>
                        <div className="service_details">
                            <h3>{services.name}</h3>
                            <p>{services.decription}</p>
                        </div>
                    </div>

                )))}
            </div>
        </div>
    )
}

export default Features