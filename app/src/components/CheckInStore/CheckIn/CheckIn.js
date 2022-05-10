import React, { useEffect, useState } from 'react';
import { ref, onValue, push, set } from 'firebase/database';
import { db } from '../../../firebase-config';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

const CheckIn = () => {
    const [inDB, setInDB] = useState('');
    const [sensorFingerprint, setSensorFingerprint] = useState(-1);
    const [allowEntry, setAllowEntry] = useState(false);
    const [account, setAccount] = useState('');

    let navigate = useNavigate();

    function loadUsers() {
        onValue(ref(db, '/Users'), (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                setInDB([]);
                Object.values(data).map((it) => {
                    // console.log('USERS', it);
                    setInDB((oldArray) => [
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
        onValue(ref(db, '/Registered/Id/'), (snapshot) => {
            const data = snapshot.val();
            setSensorFingerprint(-1);
            if (data !== null) {
                Object.values(data).map((it) => {
                    setSensorFingerprint(it);
                    console.log('LOADUSERFINGER', it);
                });
            }
        });
    }

    function registerEntry() {
        push(ref(db, 'CheckIn/Entries'), {
            entry: {
                time: new Date().toLocaleTimeString('en-US'),
                account: account,
            },
        });
    }

    function handleCancellation() {
        set(ref(db, '/Registered/Id/'), {});

        let path = `/`;
        navigate(path);
    }

    useEffect(() => {
        if (allowEntry) {
            registerEntry();
        }
    }, [allowEntry]);

    useEffect(() => {
        setAllowEntry(false);
        for (let i = 0; i < inDB.length; i++) {
            if (inDB[i].fingerprint === sensorFingerprint) {
                setAllowEntry(true);
                setAccount(inDB[i].account);
            }
        }
    }, [inDB, sensorFingerprint]);

    useEffect(() => {
        loadUserFinger();
        loadUsers();
    }, []);

    return (
        <div>
            {(() => {
                if (allowEntry) {
                    return (
                        <div align="center">
                            <p>&nbsp;</p>
                            <h1>Entry registered! Proceed in the store</h1>{' '}
                            <h2>ACCOUNT: {account}</h2>
                            <Box textAlign="center" m={3} pt={1}>
                                <p>&nbsp;</p>
                                <Button
                                    // component={Link}
                                    // to="/"
                                    onClick={handleCancellation}
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
                        <div>
                            <h1>{allowEntry}</h1>
                            <h1>Please scan your fingerprint</h1>
                        </div>
                    );
                }
            })()}
        </div>
    );
};

export default CheckIn;
