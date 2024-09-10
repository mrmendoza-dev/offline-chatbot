<button
  type="button"
  onClick={() => {
    navigator.mediaDevices.getUserMedia({ audio: true });
  }}
  className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 hover:text-primary-700 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
>
  <FontAwesomeIcon icon={icons.faMicrophone} className="size-5" />
</button>;
