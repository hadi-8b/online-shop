<?php

namespace Modules\Auth\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;

class UserResource extends JsonResource
{
   /**
     * Transform the resource into an array.
     */
   
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }

}