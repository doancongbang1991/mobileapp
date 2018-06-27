$.support.cors = true;
function CopyParser(onComplete, xmlLocation)
{
    this.getCopy = returnCopy;
    this.getAllCopy = returnAllCopy;
    var xml = null;

    //load xml
    $.ajax
    ({
        cache: false,
        type: "GET",
        url: xmlLocation,
        dataType: "xml",
        error: function (e)
        {
            // alert('Cannot load copy.xml');
        },
        success: function (e)
        {
            xml = $(e);
            onComplete();
        }
    });

    function returnCopy(id)
    {
        var xmlNode = xml.find('item[id="' + id + '"]');
        if (xmlNode.length == 0)
        {
            return "[" + id + "]";
        }
        var txt = xmlNode.text();
        while(txt.indexOf("<br>") > -1)
        {
            txt = txt.replace("<br>", "\n", "gi");
        }
        return txt;
    }

    function returnAllCopy()
    {
        var results = { };
        xml.find('item').each(function (ix, el)
        {
            var text = $(el).text().replace("<br>", "\n");
            var id = $(el).attr("id");
            results[id] = text;
        });
        return results;
    }
}