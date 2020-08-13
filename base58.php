<?php

use Symfony\Component\Uid\BinaryUtil;

require_once (__DIR__ . '/vendor/autoload.php');


$algos = implode("\n", hash_algos());
file_put_contents(__DIR__ . '/algos.txt', $algos);

$rawHash = hash('sha3-512', '', true);
$encodedHash = hash('sha3-512', '');
var_dump($rawHash);
var_dump($encodedHash);

$firstByte = $rawHash[0];
var_dump(base_convert(ord($firstByte), 10, 16));
echo PHP_EOL;

$strings = [
    '',
    ' ',
    'https://pursuit.purescript.org/packages/purescript-web3/0.18.2/docs/Network.Ethereum.Web3.Types.Types#t:HexString',
    'http://solargeek.co/',
];

foreach ($strings as $string) {
    $code = hash('sha3-512', $string, true);

    $base64 = base64_encode($code);
    $base58 = BinaryUtil::toBase($code, BinaryUtil::BASE58);

    printf("%s - %d chars\n", $base64, strlen($base64));
    printf("%s - %d chars\n", $base58, strlen($base58));
}