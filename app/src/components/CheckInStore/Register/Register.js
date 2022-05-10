import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { ref, onValue, set, push } from 'firebase/database';
import { db } from '../../../firebase-config';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [account, setAccount] = useState('');
    const [users, setUsers] = useState([]);
    const [isregistered, setIsRegistered] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [sensorFingerprint, setSensorFingerprint] = useState(-1);

    let navigate = useNavigate();

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

        if (networkId === 5777) {
            console.log('NETWORK ID LOOP ENTERED');
            // const hello = new web3.eth.Contract(Helloabi.abi, networkData.address);
        } else {
            window.alert('the contract not deployed to detected network.');
        }
    };

    function loadUsers() {
        onValue(ref(db, '/Users'), (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                Object.values(data).map((it) => {
                    setUsers((oldArray) => [
                        ...oldArray,
                        {
                            account: it.user.account,
                            fingerprint: it.user.fingerPrint,
                        },
                    ]);
                });
            }
        });
    }

    function loadUserFinger() {
        setSensorFingerprint(-1);
        onValue(ref(db, '/Registered/Id/'), (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                Object.values(data).map((it) => {
                    setSensorFingerprint(it);
                });
            }
        });
    }

    function handleCancellation() {
        set(ref(db, '/Registered/Id/'), {});

        let path = `/`;
        navigate(path);
    }

    function confirmRegistration() {
        push(ref(db, 'Users/'), {
            user: {
                account: account,
                fingerPrint: sensorFingerprint,
            },
        });

        set(ref(db, '/Registered/Id/'), {});
        let path = `/`;
        navigate(path);
    }

    useEffect(() => {
        setIsRegistered(false);
        setIsLoaded(false);
        users.map((user) => {
            if (user.account === account) {
                setIsRegistered(true);
            }
        });
        setIsLoaded(true);
    }, [users]);

    useEffect(() => {
        setIsLoaded(false);
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
            window.ethereum.on('accountsChanged', () => {
                window.location.reload();
            });
            loadUsers();
            loadUserFinger();
            loadWeb3();
            loadBlockchainData();
        }
        setIsLoaded(true);
    }, []);

    return (
        <div>
            {(() => {
                if (isLoaded && !account) {
                    return (
                        <div>
                            <p>&nbsp;</p>
                            <h1 align="center">
                                Please Connect your Account to register
                            </h1>
                        </div>
                    );
                } else if (isLoaded && isregistered) {
                    return (
                        <div align="center">
                            <p>&nbsp;</p>
                            <h1>Account is already registered!</h1>
                            <h2>ACCOUNT: {account}</h2>
                            <Box textAlign="right" m={3} pt={1}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    component={Link}
                                    to="/checkIn"
                                    fullWidth
                                    style={{ minHeight: '50px' }}
                                >
                                    Proceed to check in
                                </Button>
                            </Box>
                            <Box textAlign="right" m={3} pt={1}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    component={Link}
                                    to="/"
                                    fullWidth
                                    style={{ minHeight: '50px' }}
                                >
                                    Go Back
                                </Button>
                            </Box>
                        </div>
                    );
                } else if (
                    isLoaded &&
                    !isregistered &&
                    sensorFingerprint === -1
                ) {
                    return (
                        <div align="center">
                            <p>&nbsp;</p>

                            <h1>REGISTER</h1>
                            <h2>ACCOUNT: {account}</h2>
                            <h2>
                                Please scan your fingerprint to register
                                yourself
                            </h2>
                            <p>&nbsp;</p>
                            <Box textAlign="right" m={3} pt={1}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleCancellation}
                                    fullWidth
                                    style={{ minHeight: '50px' }}
                                >
                                    Go back
                                </Button>
                            </Box>
                        </div>
                    );
                } else if (isLoaded && sensorFingerprint !== -1) {
                    return (
                        <div align="center">
                            <p>&nbsp;</p>
                            <h1>REGISTER</h1>
                            <h2>ACCOUNT: {account}</h2>
                            <h2>Entry Registered!</h2>
                            <h3>
                                Fingerprint Scanned. Press the below button to
                                register
                            </h3>
                            <Box textAlign="right" m={3} pt={1}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={confirmRegistration}
                                    fullWidth
                                    style={{ minHeight: '50px' }}
                                >
                                    Confirm Registration
                                </Button>
                            </Box>
                            <Box textAlign="right" m={3} pt={1}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleCancellation}
                                    fullWidth
                                    style={{ minHeight: '50px' }}
                                >
                                    Cancel Registration
                                </Button>
                            </Box>
                        </div>
                    );
                } else {
                    return <h1 align="center">LOADING...</h1>;
                }
            })()}
        </div>
    );
};

export default Register;
