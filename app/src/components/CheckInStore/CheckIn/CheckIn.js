import React, { useDebugValue, useEffect, useState } from 'react';
import { ref, onValue, push, update } from 'firebase/database';
import Web3 from 'web3';
import { db } from '../../../firebase-config';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

const CheckIn = () => {
    const [allowed, setAllowed] = useState([]);
    const [account, setAccount] = useState('');
    const [users, setUsers] = useState([]);
    const [isregistered, setIsRegistered] = useState(false);

    function registerEntry() {
        push(ref(db, 'CheckIn/Entries'), {
            entry: {
                // account: allowed[1],
                time: new Date().toLocaleTimeString('en-US'),
                account: 'Random Guy waving hand',
            },
        });
    }

    function loadUsers() {
        setUsers([]);
        setIsRegistered(false);
        onValue(ref(db, '/Users'), (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                Object.values(data).map((it) => {
                    setUsers((oldArray) => [...oldArray, it.user.account]);
                    // console.log(it.user.account);
                });
            }
        });
    }

    const loadWeb3 = async () => {
        if (window.ethereum) {
            await window.ethereum.enable();
        } else {
            window.alert(
                'Non-Ethereum browser detected. You should consider trying MetaMask!'
            );
        }
    };

    const loadBlockchainData = async () => {
        // setLoading(true);
        if (typeof window.ethereum == 'undefined') {
            return;
        }
        const web3 = new Web3(window.ethereum);

        let url = window.location.href;
        console.log(url);

        const accounts = await web3.eth.getAccounts();

        if (accounts.length === 0) {
            return;
        }
        setAccount(accounts[0]);
        const networkId = await web3.eth.net.getId();

        if (networkId == 5777) {
            console.log('NETWORK ID LOOP ENTERED');
            // const hello = new web3.eth.Contract(Helloabi.abi, networkData.address);
        } else {
            window.alert('the contract not deployed to detected network.');
        }
    };

    function resetEntry() {
        const AllowedEntry = {
            Allowed: 0,
        };
        const updates = {};
        updates['/CheckIn/AllowedEntry'] = AllowedEntry;
        update(ref(db), updates);
    }

    async function getFingerprint() {
        //Load RFID tags
        onValue(ref(db, '/CheckIn/AllowedEntry'), (snapshot) => {
            setAllowed([]);
            const data = snapshot.val();
            if (data !== null) {
                Object.values(data).map((it) => {
                    setAllowed((oldArray) => [...oldArray, it]);
                });
            }
        });
    }

    useEffect(() => {
        if (allowed[0] === 1) {
            registerEntry();
            resetEntry();
        }
    }, [allowed]);

    useEffect(() => {
        users.map((user) => {
            console.log(user);
            if (user === account) {
                setIsRegistered(true);
            }
        });
    }, [users]);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
            window.ethereum.on('accountsChanged', () => {
                window.location.reload();
            });

            loadWeb3();
            loadBlockchainData();
            getFingerprint();
            loadUsers();
        }
    }, []);

    return (
        <div>
            {(() => {
                if (!account) {
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
                } else if (account && !isregistered) {
                    return (
                        <div align="center">
                            <p>&nbsp;</p>
                            <h1>
                                Your account is not registered! Kindly register
                                to enter the store.
                            </h1>
                            <Box textAlign="center" m={3} pt={1}>
                                <p>&nbsp;</p>
                                <Button
                                    component={Link}
                                    to="/register"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    style={{ minHeight: '50px' }}
                                >
                                    Register
                                </Button>
                            </Box>
                        </div>
                    );
                } else if (account && allowed[0] == 1) {
                    return (
                        <div align="center">
                            <p>&nbsp;</p>
                            <h1>Entry registered! Proceed in the store</h1>{' '}
                            <h2>ACCOUNT: {account}</h2>
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
                } else if (account && allowed[0] === 0) {
                    return (
                        <div align="center">
                            <p>&nbsp;</p>
                            <h1>Please scan your fingerprint</h1>
                            <h2>ACCOUNT: {account}</h2>
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
                            <p>&nbsp;</p>
                            <h1 align="center">
                                Fingerprint not found. Please Register
                                <Box textAlign="center" m={3} pt={1}>
                                    {' '}
                                    <Button
                                        component={Link}
                                        to="/register"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        style={{ minHeight: '50px' }}
                                    >
                                        Register
                                    </Button>
                                </Box>
                            </h1>
                        </div>
                    );
                }
            })()}
        </div>
    );
};

export default CheckIn;
