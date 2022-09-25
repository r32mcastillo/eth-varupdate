import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState, useMemo } from 'react';
import PunksArtifact from './config/artifacts/Punks';
import { connector } from './config/web3';
import useTruncatedAddress from './hooks/useTruncatedAddress';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import "./App.css"

const { address, abi } = PunksArtifact;

function App() {
    const { active, activate, deactivate, account, error, library, chainId } = useWeb3React();
    const [msg, setMsg] = useState("");
    const [msgContract, setMsgContract] = useState("<<Aqui va el mensaje>>");
    const [balance, setBalance] = useState(0);
    const isUnsupportedChain = error instanceof UnsupportedChainIdError;
    const truncatedAddress = useTruncatedAddress(account);

    const connect = useCallback(() => {
        activate(connector)
        localStorage.setItem("previouslyConnected", "true")
    }, [activate]);
    const disconect = () => {
        console.log(active);
        deactivate();
        localStorage.removeItem("previouslyConnected");
    }
    const getBalance = useCallback(async () => {
        if (active) {
            const toSet = await library.eth.getBalance(account);
            setBalance((toSet / 1e18).toFixed(4));
        } else { setBalance(0); }
    }, [library?.eth, account])


    // get Contract
    const contract = useMemo(() => {
        if (active) return new library.eth.Contract(abi, address[chainId]);
    }, [active, chainId, library?.eth?.Contract]);


    const getMsg = useCallback(
        async () => {
            if (contract) {
                const oj = await contract.methods.get().call();
                setMsgContract(oj);
            } else { }
        }, [contract]
    );
    const mint = () => {
        contract.methods
            .set(msg)
            .send({
                from: account,
            })
            .on("transactionHash", (txHash) => {
                console.log("Transacción enviada");
                toast.info('Transacción enviada', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .on("receipt", () => {
                console.log("Transacción confirmada");
                getMsg();
                toast.success('Transacción confirmada', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .on("error", (error) => {
                console.error("Transacción fallida");
                toast.error('Transacción fallida', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    };

    useEffect(() => {
        if (localStorage.getItem("previouslyConnected") === "true") {
            connect();
            getBalance();
        }
    }, [connect]);

    useEffect(() => {
        getMsg();
    });

    const handleChange = (event) => {
        setMsg(event.target.value);
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        mint();
    }
    return (
        <div style={{ textAlign: "center" }}>
            <ToastContainer theme='colored' />

            <div class="contenedor">
                <header class="main-header">
                    <div>
                        <img src="https://raw.githubusercontent.com/r32mcastillo/reactpractico/main/src/assets/logos/log.png" alt="logo" width="50" height="auto" />
                    </div>            <div>
                        <p><a target="_blank" href="https://github.com/r32mcastillo">https://github.com/r32mcastillo</a></p>
                    </div>
                    <div>
                        <h2>ETH</h2>
                    </div>
                </header>

                <section class="item">
                    <article class="item">
                        {active&&
                        <form onSubmit={handleSubmit}>
                            <label>
                                <input type="text" onChange={handleChange} />
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                     }
                  
                    </article>

                    <article className='msg'>
                    <h2>
                    {msgContract}
                    </h2>

                    </article>
                </section>
                <aside class="item">
                    <h3>Leer y escribir en una variable de estado</h3>
                 
                    {isUnsupportedChain &&
                        <div><strong style={{ border: "solid red" }} >
                            Red no soportada, Conectate a la Red de Prueba de Rinkeby
                        </strong></div>}
                    <div>¿Ya conectaste tu Metamask?: {active ? "Metamask Conectado" : "Metamask No conectado"}</div>
                    <div>chainId : {chainId}</div>
                    <div>Cuenta: {truncatedAddress}</div>
                    <div>Balance: {balance}</div>



                    <br />
                    <br />
                    {!active ?
                        <button
                            onClick={connect}>
                            Conectar
                        </button>
                        :
                        <button
                            onClick={disconect}>
                            Desconectar
                        </button>
                    }
                </aside>

                <footer class="main-footer">
                    <div>Desarrollado por: Miguel Castillo</div>
                    <div>
                        <p><a target="_blank" href="https://github.com/r32mcastillo/eth-varupdate">GitHub</a></p>
                        <p><a target="_blank" href="https://github.com/r32mcastillo">GitHub r32mcastillo</a></p>
                        <p><a target="_blank" href="https://www.linkedin.com/in/miguel-castillo-cortes/">Linkedin</a></p>
                    </div>
                </footer>
            </div>


        </div>
    );
}

export default App;
