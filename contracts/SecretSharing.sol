// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract SecretSharing {
    
    // Struct representing a point in 2D space
    struct Point {
        int x; // x-coordinate
        int y; // y-coordinate
    }

    // Struct representing a fraction
    struct Fraction {
        int256 numerator;   // Numerator of the fraction
        int256 denominator; // Denominator of the fraction
    }

    // Constructor function.
    constructor() {
        // Empty constructor, no initialization needed
    }

    // Function to compute the greatest common divisor (GCD) of two integers
    function gcd(int256 a, int256 b) public pure returns (int256) {
        while (b != 0) {
            int256 temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Function to reduce a fraction to its simplest form
    function reduceFraction(Fraction memory f) public pure returns (Fraction memory) {
        // Calculate the greatest common divisor (GCD) of the numerator and denominator
        int256 gcdValue = gcd(f.numerator, f.denominator);
    
        // Divide both numerator and denominator by their GCD to simplify the fraction
        f.numerator /= gcdValue;
        f.denominator /= gcdValue;
    
        // Return the simplified fraction
        return f;
    }


    // Function to multiply two fractions
    function multiply(Fraction memory f1, Fraction memory f2) public pure returns (Fraction memory) {
        Fraction memory temp = Fraction(f1.numerator * f2.numerator, f1.denominator * f2.denominator);
        return reduceFraction(temp);
    }

    // Function to add two fractions
    function add(Fraction memory f1, Fraction memory f2) public pure returns (Fraction memory) {
        Fraction memory temp = Fraction(
            f1.numerator * f2.denominator + f1.denominator * f2.numerator,
            f1.denominator * f2.denominator
        );
        return reduceFraction(temp);
    }


    
    // Function to calculate the y-coordinate for a given x-coordinate using a polynomial
    function calculateY(int x, int[] memory poly) public pure returns (int y) {
        // Initializing y
        y = 0;
        int temp = 1;
 
        // Iterating through the polynomial coefficients
        for (uint256 i = 0; i < poly.length; i++) {
            int coeff = poly[i];
 
            // Computing the value of y
            y = y + (coeff * temp);
            temp = temp * x;
        }
    }



    // Function to generate shares for a secret value
    function generateShares(int S, uint N, uint256 K) public view returns (Point[] memory){
        Point[] memory points = new Point[](N);
        int[] memory poly = new int[](K); // Array to store polynomial coefficients
        poly[0] = S; // Set the constant term of the polynomial to the secret value S
        
        // Generate random coefficients for the polynomial
        for (uint256 j = 1; j < K; ++j) {
            int256 p = 0;
            while (p == 0) {
                p = int256(uint256(keccak256(abi.encodePacked(block.timestamp, j)))) % 1000000007; // Use block timestamp and j as a source of randomness
            }
            poly[j] = p;
        }
        
        // Calculate shares for each x-coordinate
        for (uint j = 1; j <= N; ++j) {
            uint x = j;
            int y = calculateY(int(x), poly);
            uint256 piy = uint256(j-1);
            points[piy].x = int(x);
            points[piy].y = y;
        }
        
        return points;
    }

    

    // Function to reconstruct the secret value from shares
    function reconstructSecret(int256[] memory x, int256[] memory y, uint256 M, uint256 threshold) public pure returns (int256) {
        require(M >= threshold, "Threshold number of shares not provided!");
        Fraction memory ans = Fraction(0, 1); // Initialize the result fraction
        
        // Loop through the provided shares
        for (uint256 i = 0; i < M; ++i) {
            Fraction memory l = Fraction(y[i], 1); // Initialize Lagrange term with y-coordinate of the current share
            
            // Calculate Lagrange interpolation terms
            for (uint256 j = 0; j < M; ++j) {
                if (i != j) {
                    Fraction memory temp = Fraction(-x[j], x[i] - x[j]);
                    l = multiply(l, temp);
                }
            }

            ans = add(ans, l); // Add the Lagrange term to the result
        }

        // Return the reconstructed secret value
        return ans.numerator;
    }
}
