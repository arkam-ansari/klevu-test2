# Klevu JS Technical Assignment - 002

Below are the assignment action items that needs to be completed in this test.

## Tasks

1.  You need to send a HTTP POST request to the below request along with the provided data.

    Request Method: POST
    Request URL: https://eucs23v2.ksearchnet.com/cs/v2/search
    Request Payload:

    ```json
    {
      "context": { "apiKeys": ["klevu-160320037354512854"] },
      "recordQueries": [
        {
          "id": "configLayoutProducts564",
          "typeOfRequest": "SEARCH",
          "settings": {
            "query": { "term": "bags" },
            "typeOfRecords": ["KLEVU_PRODUCT"],
            "limit": 12,
            "typeOfSearch": "WILDCARD_AND"
          }
        }
      ]
    }
    ```

2.  In the response, you need to parse the product data under the records attribute.
3.  Prepare data object for the products and other information (OOP).
4.  In the `index.html` we have provided a static html. You need to render the UI dynamically from the response data.
5.  In the UI provide a dropdown to sort the result set to price `Low To High` and `High To Low`.
6.  Provide a button on the products UI for `Quick View` functionality.
7.  After clicking on `Quick View` button, user should be able to see a popup containing all the information of a selected product.
8.  Fetch total number of products count from the response and append it to UI `label`.

Please find the below files to this test.

### index.html

It contains the html structure of a test.

### styles.css

It contains the styles of a test.

> Note:
>
> - All the JS code must be in the Core JS only and Object Oriented. (Code should compatible with all the browsers including older versions.)
> - No other CSS framework can be used. If any CSS work is there it must be written in pure CSS.
