package main

import (
	"crypto/sha256"
	"encoding/hex"
	"strconv"
)

func main() {

}

func SolveChallenge(prefix string, target string) string {
	var attempts int = 0
	var nonce int = 0
	var hexValue, err = hex.DecodeString(target)

	if err != nil {
		panic(err)
	}

	for {
		attempts++

		var input string = prefix + strconv.Itoa(nonce)
		var hash []byte = StringtoSHA256(input)

		if VerifyNonce(hash, hexValue) {
			break
		}

		nonce++
	}

	return prefix + ":" + strconv.Itoa(nonce)
}

func StringtoSHA256(input string) []byte {
	hash := sha256.New()
	hash.Write([]byte(input))

	return hash.Sum(nil)
}

func VerifyNonce(hash []byte, target []byte) bool {
	if len(hash) != len(target) {
		return false
	}

	for i := 0; i < len(hash)-1; i++ {
		if hash[i] > target[i] {
			return false
		} else if hash[i] < target[i] {
			break
		}
	}

	return true
}
