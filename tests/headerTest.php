<?php

use PHPUnit\Framework\TestCase;

class HeaderTest extends TestCase
{
    public function testHeader()
    {
        ob_start();
        require_once 'public_html/mass/header.php';
        $output = ob_get_clean();

        $this->assertStringContainsString('<HTML lang=en dir=ltr data-bs-theme="light" xmlns="http://www.w3.org/1999/xhtml">', $output, 'HTML head is not set up correctly');
        $this->assertStringContainsString('<link href=\'css/styles.css\' rel=\'stylesheet\' type=\'text/css\'>', $output, 'CSS file is not loaded');
        $this->assertStringContainsString('<script src=\'https://tools-static.wmflabs.org/cdnjs/ajax/libs/jquery/3.7.0/jquery.min.js\'></script>', $output, 'jQuery is not loaded');
        $this->assertStringContainsString('<nav id="mainnav" class="navbar navbar-expand-lg shadow">', $output, 'Navigation bar is not set up');
        $this->assertStringContainsString('<a class="navbar-brand mb-0 h1" href="index.php" style="color:#0d6efd;">', $output, 'Brand link is not set up');
        $this->assertStringContainsString('<script>function user_login()', $output, 'User login function is not set up');
    }
}
