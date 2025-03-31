const fields = [
  'title',
  'FirstName',
  'Last Name',
  'email',
  'userName',
  'Gender',
  'Company',
  'phone',
  'address',
  'address2',
  'address3',
  'zip',
  'city',
]

const stateSelect = (
  <select className="mb-8 w-full rounded-sm border px-3 py-2 leading-tight text-gray-700 shadow-sm">
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    <option value="AR">Arkansas</option>
    <option value="CA">California</option>
    <option value="CO">Colorado</option>
    <option value="CT">Connecticut</option>
    <option value="DE">Delaware</option>
    <option value="DC">District Of Columbia</option>
    <option value="FL">Florida</option>
    <option value="GA">Georgia</option>
    <option value="HI">Hawaii</option>
    <option value="ID">Idaho</option>
    <option value="IL">Illinois</option>
    <option value="IN">Indiana</option>
    <option value="IA">Iowa</option>
    <option value="KS">Kansas</option>
    <option value="KY">Kentucky</option>
    <option value="LA">Louisiana</option>
    <option value="ME">Maine</option>
    <option value="MD">Maryland</option>
    <option value="MA">Massachusetts</option>
    <option value="MI">Michigan</option>
    <option value="MN">Minnesota</option>
    <option value="MS">Mississippi</option>
    <option value="MO">Missouri</option>
    <option value="MT">Montana</option>
    <option value="NE">Nebraska</option>
    <option value="NV">Nevada</option>
    <option value="NH">New Hampshire</option>
    <option value="NJ">New Jersey</option>
    <option value="NM">New Mexico</option>
    <option value="NY">New York</option>
    <option value="NC">North Carolina</option>
    <option value="ND">North Dakota</option>
    <option value="OH">Ohio</option>
    <option value="OK">Oklahoma</option>
    <option value="OR">Oregon</option>
    <option value="PA">Pennsylvania</option>
    <option value="RI">Rhode Island</option>
    <option value="SC">South Carolina</option>
    <option value="SD">South Dakota</option>
    <option value="TN">Tennessee</option>
    <option value="TX">Texas</option>
    <option value="UT">Utah</option>
    <option value="VT">Vermont</option>
    <option value="VA">Virginia</option>
    <option value="WA">Washington</option>
    <option value="WV">West Virginia</option>
    <option value="WI">Wisconsin</option>
    <option value="WY">Wyoming</option>
  </select>
)

const getSimpleLabelAndInput = (fieldName: string) => {
  return (
    <label key={fieldName} className="mb-2 block text-sm font-bold text-gray-700">
      {fieldName}
      <input
        type="text"
        name={fieldName}
        className="mb-5 w-full appearance-none rounded-sm border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:outline-1"
      />
    </label>
  )
}

const FormFillDemo = () => {
  return (
    <div className="m-5 mt-10 flex flex-col items-center p-5">
      This is a simple form fill page for testing the autofill functionality of your browser or
      password manager. Data is never sent anywhere.
      <div className="mt-10 w-full max-w-xs">
        <form className="mb-4 rounded-sm px-8 pb-8 pt-6 shadow-md">
          {fields.map((f) => getSimpleLabelAndInput(f))}
          <div className="flex flex-col">
            <div className="mb-2 block text-sm font-bold text-gray-700">State</div>
            {stateSelect}
          </div>
          <div className="flex justify-around">
            <input
              type="reset"
              value="Reset"
              className="rounded-sm bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            />
            <input
              type="submit"
              value="Submit"
              className="rounded-sm bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormFillDemo
