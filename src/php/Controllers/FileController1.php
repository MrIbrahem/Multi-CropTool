<?php

namespace CropTool\Controllers;

use CropTool\EditSummary;
use CropTool\File\FileInterface;
use CropTool\Image;
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
    
    public function publishnew(Response $response, Request $request, WikiPage $page, FactoryInterface $factory, LoggerInterface $logger)
    {

        $body = $request->getParsedBody();
        $pageno = 0;
        $editComment = array_get($body, 'comment');
        $newName = array_get($body, 'filename');
        $file = array_get($body, 'file');

        $page->assertExists();

        // ROOT_PATH + '/public_html'
        // $filepath = $page->file->getAbsolutePathForPage($pageno, '_cropped');
        $filepath = ROOT_PATH + '/public_html/mass/files/' . $newName;

        // tmp_name
        $filepath = $file['tmp_name'];

        $wikitext = $page->wikitext;
        $elems = [];

        $newPage = $factory->make(WikiPage::class, ['title' => $newName]);
        if (!$ignoreWarnings) {
            $newPage->assertNotExists();
        }

        // Remove templates before appending {{Extracted from}}
        $wikitext = $wikitext->withoutTemplatesNotToBeCopied();

        if (in_array($newPage->site, $sitesSupportingExtractedFromTemplate)) {
            $wikitext = $wikitext->appendExtractedFromTemplate($page->title);
        }
        $newPage->setWikitext($wikitext);

        $uploadResponse = $newPage->upload($filepath, $editComment, $ignoreWarnings);
        $logger->info('Uploaded new version of "' . $page->title . '" as "' . $newPage->title . '".');

        $editSummary = new EditSummary();

        if (in_array($page->site, $sitesSupportingImageExtractedTemplate)) {
            $wt0 = $page->wikitext;
            $editSummary->add('adding/updating {{Image extracted}}');
            $page->setWikitext($wt0->appendImageExtractedTemplate($newName))
                ->save($editSummary->build());
        }

        $uploadResponse->elems = $elems;

        return $response->withJson($uploadResponse);
    }
}
