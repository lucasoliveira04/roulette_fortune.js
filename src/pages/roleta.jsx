import React, { useState, useEffect } from "react";
import "../public/roleta.css";

export const RoletaPage = () => {
    const numeros = Array.from({ length: 35 }, (_, index) => index + 1);
    const espacamento = 15;
    const [roletaSize, setRoletaSize] = useState(400);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 644) {
                setRoletaSize(300); 
            } else {
                setRoletaSize(400); 
            }
        };

        handleResize(); 
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const calcularTransform = (index, roletaSize) => {
        // Ajusta a distância entre os botões dependendo do tamanho da tela
        let distanciaEntreBotoes = roletaSize * 0.575;

        // Ajuste para telas menores
        if (window.innerWidth <= 644) {
            distanciaEntreBotoes = roletaSize * 0.5; 
        }

        const angulo = (360 / 35) * index + espacamento;

        return `rotate(${angulo}deg) translate(${distanciaEntreBotoes}px) rotate(${-(angulo)}deg)`;
    };

    const sortearNumero = (numero) => {
        console.log(`Número sorteado: ${numero}`);
    };

    return (
        <div className="container-fluid">
            <div className="roleta-container">
                {numeros.map((numero, index) => (
                    <button
                        key={numero}
                        value={numero}
                        className="roleta-button"
                        style={{
                            transform: calcularTransform(index, roletaSize)
                        }}
                        onClick={() => sortearNumero(numero)}
                    >
                        {numero}
                    </button>
                ))}
            </div>

            <div>
                <button onClick={() => alert('A roleta foi sorteada!')}>Sortear</button>
            </div>
        </div>
    );
};
