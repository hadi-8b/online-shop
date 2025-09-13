<?php

namespace Modules\User\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserProfileResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'profile_picture' => $this->profile_picture,
            'card_number' => $this->card_number,
            'created_at' => $this->created_at->format('Y-m-d'),
            // همه اطلاعات شخصی خودش
        ];
    }
}