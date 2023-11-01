<?php

namespace CropTool\Controllers;

use CropTool\EditSummary;
use CropTool\File\FileInterface;
use CropTool\Image;
use CropTool\ApiService;
use CropTool\WikiPage;
use DI\FactoryInterface;
use Psr\Log\LoggerInterface;
use Slim\Http\Request;
use Slim\Http\Response;

class FileController1
{
    protected $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * Utility method to return an array with the relative path + file dimensions
     *
     * @param FileInterface $file
     * @param Image $img
     * @param int $pageno
     * @param string $suffix
     * @return array|null
     */
    
    public function publishnewxasdasd(Response $response, Request $request, WikiPage $page, FactoryInterface $factory, LoggerInterface $logger)
    {
        $body = $request->getParsedBody();
        $pageno = 0;
        $editComment = array_get($body, 'comment');
        $newName = array_get($body, 'filename');
        $file = array_get($body, 'file');
        $ignoreWarnings = boolval(array_get($body, 'ignorewarnings', false));

        // ROOT_PATH + '/public_html'
        // $filepath = $page->file->getAbsolutePathForPage($pageno, '_cropped');
        $filepath = ROOT_PATH + '/public_html/mass/files/' . $newName;

        // tmp_name
        // $filepath = $file['tmp_name'];

        $elems = [];

        $newPage = $factory->make(WikiPage::class, ['title' => $newName]);
        if (!$ignoreWarnings) {
            $newPage->assertNotExists();
        }

        // Remove templates before appending {{Extracted from}}
        // $wikitext = $wikitext->withoutTemplatesNotToBeCopied();


        $uploadResponse = $newPage->upload($filepath, $editComment, $ignoreWarnings);
        $logger->info('Uploaded new "' . $newPage->title . '".');

        // $editSummary = new EditSummary();

        $uploadResponse->elems = $elems;

        return $response->withJson($uploadResponse);
    }
    
    public function publishnew(Response $response, Request $request, WikiPage $page, FactoryInterface $factory, LoggerInterface $logger)
    {

        // @TODO: DRY
        $body = $request->getParsedBody();
        // $pageno = 0;
        // $overwrite = array_get($body, 'overwrite') == 'overwrite';
        $editComment = array_get($body, 'comment');
        // $stuffToRemove = array_get($body, 'elems');
        // $ignoreWarnings = boolval(array_get($body, 'ignorewarnings', false));
        //---
        // $newName = array_get($body, 'title');
        $newName = $body['title'] ?? $page->title;
        // $cropPath = $page->file->getAbsolutePathForPage($pageno, '_cropped');
        if ($newName == '') {
            throw new \RuntimeException('No filename provided.');
        }
        //---
        $cropPath = ROOT_PATH . '/public_html/mass/files/' . $newName;
        //---
        if (!file_exists($cropPath)) {
            throw new \RuntimeException('File does not exist: ' . $cropPath);
        }
        //---
        if ($page->exists) {
            throw new \RuntimeException('File already exists: ' . $page->title);
        }
        //---
        // $wikitext = $page->wikitext;
        // $elems = [];
        //---
        $uploadResponse = $page->upload($cropPath, $editComment, false);
        //---
        // $newPage = $factory->make(WikiPage::class, ['title' => $newName]);

        // Remove templates before appending {{Extracted from}}
        // $wikitext = $wikitext->withoutTemplatesNotToBeCopied();


        // $newPage->setWikitext($wikitext);

        // $uploadResponse = $newPage->upload($cropPath, $editComment, $ignoreWarnings);
        // $logger->info('Uploaded new version of "' . $page->title . '" as "' . $newPage->title . '".');

        // $editSummary = new EditSummary();


        // $uploadResponse->elems = $elems;

        return $response->withJson($uploadResponse);
    }
}
