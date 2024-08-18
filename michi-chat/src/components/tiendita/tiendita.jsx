import React from 'react'
import './tiendita.css'
import magicbara from '../../assets/pictures/elgato.png'
import monedita from '../../assets/moneditas.png'
import patito from '../../assets/sombreritos/patito.png'
import santahat from '../../assets/sombreritos/santahat.png'
import cuernos from '../../assets/sombreritos/cuernos.png'
import michiorejas from '../../assets/sombreritos/michiorejas.png'
import chefhat from '../../assets/sombreritos/chefhat.png'
function tiendita() {
  return (
    <div className='tiendita'>
      <div className="tiendita_nav">
        <a href=""><h3>Tiendita</h3></a>
        <a href=""><h3>Mis cosmeticos</h3></a>
      </div>
      <div className="tiendita_main">
        <h1>Tiendita</h1>
        <div className="productos">
            <div className="producto">
                <div className="muestra">
                    <img src={magicbara} alt="" className='muestra_pic'/>
                    <img src={patito} alt='' className='sombrerito'/>
                </div>
                <h3>Patito</h3>
                <div className="precio">
                <button><p>10</p>
                <img src={monedita} alt="" /></button>
                    
                </div>
            </div>
            <div className="producto">
                <div className="muestra">
                    <img src={magicbara} alt="" className='muestra_pic'/>
                    <img src={santahat} alt='' className='sombrerito' style={{left:'40px'}}/>
                </div>
                <h3>Santa</h3>
                <div className="precio">
                <button><p>10</p>
                <img src={monedita} alt="" /></button>
                    
                </div>
            </div>
            <div className="producto">
                <div className="muestra">
                    <img src={magicbara} alt="" className='muestra_pic'/>
                    <img src={cuernos} alt='' className='sombrerito' style={{left:'50px'}}/>
                </div>
                <h3>Bisonte 👹</h3>
                <div className="precio">
                <button><p>10</p>
                <img src={monedita} alt="" /></button>
                    
                </div>
            </div>
            <div className="producto">
                <div className="muestra">
                    <img src={magicbara} alt="" className='muestra_pic'/>
                    <img src={michiorejas} alt='' className='sombrerito' style={{left:'30px', top:'-55px', width:'150px', height:'130px'}}/>
                </div>
                <h3>Egirl</h3>
                <div className="precio">
                <button><p>10</p>
                <img src={monedita} alt="" /></button>
                    
                </div>
            </div>
            <div className="producto">
                <div className="muestra">
                    <img src={magicbara} alt="" className='muestra_pic'/>
                    <img src={chefhat} alt='' className='sombrerito' style={{left:'70px', top:'-80px', width:'120px', height:'120px'}}/>
                </div>
                <h3>Let him cook</h3>
                <div className="precio">
                <button><p>10</p>
                <img src={monedita} alt="" /></button>
                    
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default tiendita
