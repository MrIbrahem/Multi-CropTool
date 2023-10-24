<?php

require_once 'PHPUnit/Autoload.php';

class HeaderTest extends PHPUnit\Framework\TestCase {

    public function testHeader() {
        // Simulate server name
        $_SERVER['SERVER_NAME'] = 'localhost';

        // Check if server name is correctly set
        $this->assertSame('localhost', $_SERVER['SERVER_NAME']);

        // Mock jQuery.ajax function
        $mockAjax = $this->getMockBuilder('jQuery')
                         ->setMethods(['ajax'])
                         ->getMock();

        // Simulate different server responses
        $mockAjax->method('ajax')
                 ->will($this->onConsecutiveCalls(
                     ['error' => 'Unauthorized', 'messages' => []],
                     ['user' => 'Mr. Ibrahem']
                 ));

        // Check if user login function handles different server responses correctly
        $this->assertScript('user_login', $mockAjax);

        // Check if HTML code is correctly formed
        $html = file_get_contents('public_html/mass/header.php');
        $this->assertValidHtml($html);
    }
}

// Run test suite
$testSuite = new PHPUnit\Framework\TestSuite();
$testSuite->addTestSuite('HeaderTest');
PHPUnit\TextUI\TestRunner::run($testSuite);
