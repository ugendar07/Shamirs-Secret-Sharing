# Secret Sharing Smart Contract

This repository contains a Solidity smart contract for secret sharing implemented using polynomial interpolation. The contract provides functions for generating shares of a secret, reconstructing the secret from shares, and performing arithmetic operations on fractions.

## Smart Contract Details

The `SecretSharing` contract consists of the following main functions:

- `calculateY`: Calculates the y-coordinate for a given x-coordinate using a polynomial.
- `generateShares`: Generates shares of a secret value based on a polynomial with random coefficients.
- `gcd`: Computes the greatest common divisor (GCD) of two integers.
- `reduceFraction`: Reduces a fraction to its simplest form.
- `add`: Adds two fractions.
- `reconstructSecret`: Reconstructs the secret value from a given set of shares.

## Testing

The smart contract is tested using JavaScript tests written with the Truffle testing framework. The tests cover various functionalities of the contract, including calculating Y values, generating shares, computing GCD, adding fractions, reducing fractions, and reconstructing the secret.

 
