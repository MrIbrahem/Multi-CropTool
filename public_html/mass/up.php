<?php
//---
echo <<<HTML
<div class='card'>
    <div class='card-header'>
    </div>
    <div class='card-body'>
        
        <form id="uploadForm" enctype="multipart/form-data">
            <div class="mb-3">
                <label for="imageUpload">Select Images</label>
                <input type="file" class="form-control" id="imageUpload" name="imageUpload[]" multiple>
            </div>
            <button type="submit" class="btn btn-primary">Upload</button>
        </form>
        <div id='bar'>
            <div class="progress" role="progressbar" aria-label="Warning example" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar text-bg-warning" id='progress-bar' style="width: 0%">0%</div>
            </div>
        </div>
        <hr/>
        <table class='sortable table table-striped' id='result' style='display:none;'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>file</th>
                    <th>result</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>
<script>
</script>

HTML;
//---