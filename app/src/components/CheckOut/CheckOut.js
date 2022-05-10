import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase-config';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import BasicTable from './BasicTable';

import { contractABI, contractAddress } from '../../constants';

const CheckOut = () => {
    const [account, setAccount] = useState('');
    const [isloading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [pIDs, setpIDs] = useState([]);
    const [final, setFinal] = useState([]);
    const [web3Obj, setWeb3Obj] = useState('');
    const [sensorFingerprint, setSensorFingerprint] = useState(-1);
    const [inDB, setInDB] = useState({});

    const loadBlockchainData = async () => {
        if (typeof window.ethereum == 'undefined') {
            return;
        }
        const web3 = new Web3(window.ethereum);
        setWeb3Obj(web3);

        let url = window.location.href;
        console.log(url);

        const accounts = await web3.eth.getAccounts();

        if (accounts.length === 0) {
            return;
        }
        setAccount(accounts[0]);
        const networkId = await web3.eth.net.getId();

        if (networkId === 5777) {
            console.log('NETWORK ID LOOP ENTERED');
            // const hello = new web3.eth.Contract(Helloabi.abi, networkData.address);
        } else {
            window.alert('the contract not deployed to detected network.');
        }
    };

    const loadWeb3 = async () => {
        if (window.ethereum) {
            await window.ethereum.enable();
        } else {
            window.alert(
                'Non-Ethereum browser detected. You should consider trying MetaMask!'
            );
        }
    };

    function loadUserFinger() {
        onValue(ref(db, '/Registered/Id/'), (snapshot) => {
            const data = snapshot.val();
            setSensorFingerprint(-1);
            if (data !== null) {
                Object.values(data).map((it) => {
                    setSensorFingerprint(it);
                });
            }
        });
    }

    function AccountDetails() {
        onValue(ref(db, '/Users'), (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                setInDB({});
                Object.values(data).map((it) => {
                    if (it.user.account === account) {
                        setInDB({
                            account: it.user.account,
                            fingerprint: it.user.fingerPrint,
                        });
                        // console.log(it);
                    }
                });
            }
        });
    }

    const loadProducts = async () => {
        onValue(ref(db, '/Products'), (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                Object.values(data).map((it) => {
                    // console.log(it);
                    setRows((oldArray) => [
                        ...oldArray,
                        {
                            Name: it.product.Name,
                            id: it.product.id,
                            quantity: 0,
                            price: it.product.price,
                        },
                    ]);
                });
            }
        });
    };

    const readTags = async () => {
        onValue(ref(db, '/Prod/Ids'), (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                setpIDs([]);
                Object.values(data).map((it) => {
                    setpIDs((oldArray) => [...oldArray, it]);
                });
            }
        });
    };

    const payBill = async (beneficiary, amount) => {
        if (inDB.fingerprint === sensorFingerprint) {
            const Transaction_Contract = new web3Obj.eth.Contract(
                contractABI,
                contractAddress
            );
            console.log(contractABI);
            console.log(contractAddress);

            const accounts = await web3Obj.eth.getAccounts();
            const account = accounts[0];

            amount = web3Obj.utils.toWei(amount.toString());
            console.log(amount);

            const result = await Transaction_Contract.methods
                .addToBlockchain(beneficiary, amount)
                .send({
                    from: account,
                    value: amount,
                })
                .on('transactionHash', function (hash) {})
                .on('receipt', function (receipt) {})
                .on('confirmation', function (confirmationNumber, receipt) {
                    window.alert('Money has been transferred successfully!');
                })
                .on('error', function (error, receipt) {
                    console.log(error);
                    window.alert('An error has occured!');
                });

            // window.location.reload();
            console.log(result);
        } else {
            window.alert('Fingerprint not matched.');
        }
    };

    useEffect(() => {
        loadUserFinger();
        AccountDetails();
        setTotal(0);

        setFinal([]);
        let initial = [];

        for (let i = 0; i < pIDs.length; i++) {
            for (let j = 0; j < rows.length; j++) {
                if (pIDs[i] === rows[j].id) {
                    let present = false;
                    for (let k = 0; k < initial.length; k++) {
                        if (initial[k].id === rows[j].id) {
                            present = true;
                            initial[k].quantity++;
                        }
                    }
                    if (present === false) {
                        initial.push({
                            Name: rows[j].Name,
                            id: rows[j].id,
                            quantity: 1,
                            price: rows[j].price,
                        });
                    }
                }
            }
        }

        setFinal(initial);
        let tot = 0;
        for (let i = 0; i < final.length; i++) {
            tot += initial[i].price * initial[i].quantity;
        }
        setTotal(tot);
    }, [pIDs, rows]);

    useEffect(() => {
        setIsLoading(true);

        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
            window.ethereum.on('accountsChanged', () => {
                window.location.reload();
            });

            loadWeb3();
            loadBlockchainData();
            loadProducts();
            readTags();
        }
        setIsLoading(false);
    }, []);

    if (isloading) {
        return (
            <div>
                <p>&nbsp;</p>
                <h1>Loading. Please be patient</h1>
            </div>
        );
    }

    return (
        <div>
            {(() => {
                if (isloading) {
                    return <div></div>;
                }
                if (!isloading && !account) {
                    return (
                        <div align="center">
                            <p>&nbsp;</p>
                            <h1>
                                Please connect your Ethereum account to continue
                            </h1>
                            <Box textAlign="center" m={3} pt={1}>
                                <p>&nbsp;</p>
                                <Button
                                    component={Link}
                                    to="/"
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    style={{ minHeight: '50px' }}
                                >
                                    Go Back
                                </Button>
                            </Box>
                        </div>
                    );
                } else {
                    return (
                        <div align="center">
                            <p>
                                <b>ACCOUNT: </b>
                                {account}
                            </p>
                            <BasicTable rows={final} />
                            <h3>Total ETH to pay: {total}</h3>
                            <Box m={5} pt={1}>
                                <Button
                                    align="left"
                                    variant="contained"
                                    color="error"
                                    component={Link}
                                    to="/"
                                    style={{
                                        minHeight: '50px',
                                        minWidth: '180px',
                                        margin: '10px',
                                    }}
                                >
                                    Go Back
                                </Button>

                                <Button
                                    align="right"
                                    variant="contained"
                                    color="primary"
                                    style={{
                                        minHeight: '50px',
                                        minWidth: '180px',
                                        margin: '10px',
                                    }}
                                    onClick={() => {
                                        payBill(
                                            '0x07B9C50b9A8ceb78796352E181E411E93703827F',
                                            total
                                        );
                                    }}
                                >
                                    Pay
                                </Button>
                            </Box>
                        </div>
                    );
                }
            })()}
        </div>
    );
};

export default CheckOut;

// function pushProducts() {
//     push(ref(db, 'Products/'), {
//         product: {
//             Name: 'product4',
//             price: 4,
//             id: 2,
//         },
//     });
// }
