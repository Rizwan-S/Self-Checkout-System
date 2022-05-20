// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract Store {

    struct Entry {
        uint fingerprint;
        uint time_of_entry;
        address user_address;
    }

    struct Product {
        uint price;
    }

    mapping(uint => address) public users;
    mapping(uint => Product) public products_list;
    Entry private init = Entry({fingerprint : 0, time_of_entry : 0, user_address : 0x0000000000000000000000000000000000000000});
    Entry[] private entry_list = [init];


    constructor() public {
        Product memory product1;
        product1.price = 50;
        Product memory product2;
        product1.price = 100;

        products_list[1] = product1;
        products_list[2] = product2;

        uint256[] memory codes = [1, 2];
        uint price = getPrice(codes);



    }

    // option to create new user / add user using msg.sender / mapping ?? 
    function record_entry(uint _fingerprint) private {
        Entry memory entry;
        entry.fingerprint = _fingerprint;
        entry.time_of_entry = now;
        entry.user_address = msg.sender;
        entry_list.push(entry);
        // possible to add new user to array if already not present
    }

    function getPrice(uint256[] memory _rfidCodes) public returns(uint) {
        uint totalPrice = 0;
        for(uint i = 0; i<_rfidCodes.length;i++)
        {
            totalPrice += products_list[_rfidCodes[i]].price;
        }
        return totalPrice;

    }














}
