import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import './tiendita.css';
import magicbara from '../../assets/pictures/elgato.png';
import monedita from '../../assets/moneditas.png';
import patito from '../../assets/sombreritos/patito.png';
import santahat from '../../assets/sombreritos/santahat.png';
import cuernos from '../../assets/sombreritos/cuernos.png';
import michiorejas from '../../assets/sombreritos/michiorejas.png';
import chefhat from '../../assets/sombreritos/chefhat.png';
import { useUserStore } from '../../lib/userStore';
import { toast } from 'react-toastify';

function Tiendita() {
  const [points, setPoints] = useState(0);
  const { currentUser } = useUserStore();
  const [inventory, setInventory] = useState([]);
  const [activeCosmetic, setActiveCosmetic] = useState(null); // Cosmético en uso
  const [view, setView] = useState('tienda'); // Cambiar entre tienda e inventario

  const products = [
    { id: 'patito', name: 'Patito', price: 10, image: patito },
    { id: 'santahat', name: 'Santa', price: 10, image: santahat },
    { id: 'cuernos', name: 'Bisonte', price: 10, image: cuernos },
    { id: 'michiorejas', name: 'Egirl', price: 10, image: michiorejas },
    { id: 'chefhat', name: 'Let him cook', price: 10, image: chefhat }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.id));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPoints(userData.points || 0);
          setInventory(userData.inventory || []);
          setActiveCosmetic(userData.activeCosmetic || null);
        }
      } catch (error) {
        console.error("Error obteniendo datos de usuario:", error);
      }
    };
    fetchUserData();
  }, [currentUser.id]);

  const handlePurchase = async (product) => {
    if (points >= product.price && !inventory.includes(product.id)) {
      try {
        await updateDoc(doc(db, "users", currentUser.id), {
          points: points - product.price,
          inventory: arrayUnion(product.id)
        });
        setPoints(points - product.price);
        setInventory([...inventory, product.id]);
      } catch (error) {
        console.error("Error al realizar la compra:", error);
      }
    } else {
      toast.error("No tienes suficientes monedas o ya tienes este producto.", {
        position: "bottom-right",
      });
    }
  };

  const handleSetActiveCosmetic = async (cosmeticId) => {
    try {
      await updateDoc(doc(db, "users", currentUser.id), {
        activeCosmetic: cosmeticId
      });
      setActiveCosmetic(cosmeticId);
      toast.success(`${cosmeticId} ahora está en uso.`, {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error al actualizar cosmético activo:", error);
    }
  };

  return (
    <div className='tiendita'>
      <div className="tiendita_nav">
        <button className='.tiendita_nav' onClick={() => setView('tienda')}><h3>Tiendita</h3></button>
        <button className='.tiendita_nav' onClick={() => setView('inventario')}><h3>Mis cosméticos</h3></button>
      </div>
      <div className="tiendita_main">
        <h1>{view === 'tienda' ? "Tiendita" : "Mis cosméticos"}</h1>
        <div className="mis-monedas">
          <h2>Monedas: {points}</h2>
          <img src={monedita} alt="Monedas" />
      </div>
        
        {view === 'tienda' ? (
          <div className="productos">
            {products
              .filter(product => !inventory.includes(product.id))
              .map((product) => (
                <div key={product.id} className="producto">
                  <div className="muestra">
                    <img src={magicbara} alt="" className='muestra_pic'/>
                    <img src={product.image} alt={product.name} className='sombrerito'/>
                  </div>
                  <h3>{product.name}</h3>
                  <div className="precio">
                    <button onClick={() => handlePurchase(product)}>
                      <p>{product.price}</p>
                      <img src={monedita} alt=""/>
                    </button>
                  </div>
                </div>
            ))}
          </div>
        ) : (
          <div className="productos">
            {inventory.map((itemId) => {
              const item = products.find(product => product.id === itemId);
              const inUse = activeCosmetic === itemId;
              return (
                <div key={itemId} className="producto">
                  <div className="muestra">
                    <img src={magicbara} alt="" className='muestra_pic'/>
                    <img src={item.image} alt={item.name} className='sombrerito'/>
                  </div>
                  <h3>{item.name}</h3>
                  <button
                    onClick={() => handleSetActiveCosmetic(itemId)}
                    disabled={inUse}
                    className={inUse ? "in-use btn" : "btn"}
                  >
                    {inUse ? "En uso" : "Usar"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tiendita;
