// Importing required libraries
// const ethers = require('ethers');

// Importing the SecretSharing contract artifact
const SecretSharing = artifacts.require("SecretSharing");

// Contract testing suite
contract("SecretSharing", (accounts) => {
  
    let instance; // Variable to hold the contract instance

    // Before running the tests, deploy the SecretSharing contract
    before(async () => {
        instance = await SecretSharing.new(); // Deploying the contract  
    });

    // Test Case 1: Testing the calculation of Y values for a given x and polynomial
    it("should calculate Y correctly", async function () {
        const x = 2;
        const poly = [1, 2, 3, 4]; // Sample polynomial coefficients
        const expectedY = 49;

        const result = await instance.calculateY(x, poly); // Call calculateY function from the contract
        console.log("The calculated Y value is:", result.toString());
        assert.equal(result, expectedY, 'The Y values should be equal');
    });

    // Test Case 2: Testing the generation of shares for a secret value
    it("should generate shares correctly", async function () {
        const S = 65; // Secret value
        const N = 8; // Number of points
        const T = 5; // Degree of polynomial

        const result = await instance.generateShares(S, N, T); // Generate the shares
        console.log("The generated Shares are:");
        for(let i = 0; i < N; i++) {
            console.log(result[i].x, result[i].y);
        }
    });

    // Test Case 3: Testing the computation of the greatest common divisor (GCD)
    it("should compute gcd correctly", async function () {
        const a = 24;
        const b = 36;
        const expectedGCD = 12;

        const result = await instance.gcd(a, b);
        console.log("The computed GCD is:", result.toString());
        assert.equal(result, expectedGCD, 'The computed GCD should be equal to the expected one');
    });

    // Test Case 4: Testing the addition of fractions
    it("should add fractions correctly", async function () {
        const f1 = { numerator: 3, denominator: 4 };
        const f2 = { numerator: 2, denominator: 5 };
        const expectedResult = { numerator: 3 * 5 + 4 * 2, denominator: 4 * 5 };

        const result = await instance.add(f1, f2);
        console.log("The fraction that has been added is:", result.toString());
        assert.equal(result.numerator, expectedResult.numerator, 'The numerator should be equal');
        assert.equal(result.denominator, expectedResult.denominator, 'The denominator should be equal');
    });

    // Test Case 5: Testing the reduction of fractions to simplest form
    it("should reduce fractions correctly", async function () {
        const f = { numerator: 8, denominator: 12 };
        const expectedReduced = { numerator: 2, denominator: 3 };

        const result = await instance.reduceFraction(f);
        console.log("The reduced fraction is:", result.numerator, "/", result.denominator);
        assert.equal(result.numerator, expectedReduced.numerator, 'The numerator should be equal');
        assert.equal(result.denominator, expectedReduced.denominator, 'The denominator should be equal');
    });

    // Test Case 6: Testing the reconstruction of a secret value from shares
    it("should reconstruct secret correctly", async function () {
        const S = 8878244378; // Secret value
        const N = 5; // Number of points
        const T = 3; // Threshold

        const result = await instance.generateShares(S, N, T);
        console.log("Shares generated:");
        for(let i = 0; i < N; i++) {
            console.log(result[i].x, result[i].y);
        }

        const p1 = [];
        const s1 = [];
        
        for(let i = 0; i < T; i++) {  // Providing first K shares to the reconstruct function
            p1[i] = result[i].x;
            s1[i] = result[i].y;
        }
        const len = p1.length;
        const reconstructedSecret = await instance.reconstructSecret(p1, s1, len, T);
        console.log("The reconstructed secret:", reconstructedSecret.toString());
        assert.equal(reconstructedSecret, S, 'The reconstructed secret should equal to the original secret');
    });

    // Test Case 7: Testing all functionalities together
    it("should check all at once", async function(){
        const S = 320; // Secret value
        const N = 10; // Number of points
        const T = 6; // Threshold

        const shares = await instance.generateShares(S, N, T);
        console.log("The generated shares are:");
        for (let i = 0; i < N; i++) {
            console.log(shares[i].x, shares[i].y);
        }

        const p1 = [];
        const s1 = [];
        
        for(let i = 0; i < T; i++) {  // Providing first K shares to the reconstruct function
            p1[i] = shares[i].x;
            s1[i] = shares[i].y;
        }
        const len = p1.length;
        const reconstructedSecret = await instance.reconstructSecret(p1, s1, len, T);

        console.log("The reconstructed secret:", reconstructedSecret.toString());
        assert.equal(reconstructedSecret, S, "The secret should be reconstructed correctly");
    });
});
