<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Route;
use App\Http\Requests\Traits\HasApiResponseTrait;
use App\Http\Requests\Traits\RequestValidationTrait;

class VehicleRequest extends FormRequest
{
    use HasApiResponseTrait;
    use RequestValidationTrait;

    protected $validationRules = [
        'first_name'    => 'required|min:1|max:255',
        'last_name'     => 'sometimes|max:255',
    ];
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return $this->{$this->getCallableValidationMethod()}();
    }

    /**
     *
     * @return array
     */
    private function rulesPost(): array
    {
        $rules = [
        ];


        return array_merge($this->validationRules, $rules);

    }

    /**
     *
     * @return array
     */
    private function rulesPut(): array
    {
        $id = Route::current()->parameter('id');
        $portalUserService = new PortalUserService();
        $user = $portalUserService->get($id);

        $rules = [
            'email'     => ['sometimes', Rule::unique('portal_users')->ignore($user->id)],
        ];

        return array_merge($this->validationRules, $rules);
    }
}