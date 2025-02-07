<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectFileController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $request->validate([
            'file' => 'required|file|max:10240|mimes:pdf,doc,docx,xls,xlsx',
        ]);

        $file = $request->file('file');
        $path = $file->store('project-files');

        $projectFile = $project->files()->create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'type' => $file->getClientOriginalExtension(),
            'size' => $file->getSize(),
            'user_id' => auth()->id(),
        ]);

        return response()->json($projectFile, 201);
    }

    public function download(ProjectFile $file)
    {
        $this->authorize('view', $file->project);

        return Storage::download($file->path, $file->name);
    }
}