var _ = require('lodash');
var argv = require('yargs').argv;
var cheerio = require('cheerio');
var fs = require('fs');
var pd = require('pretty-data').pd;

var file = argv._[0];

fs.readFile(file, function read(err, data) {
    if (err) {
        throw err;
    }
    var $ = cheerio.load(data, {
        normalizeWhitespace: false,
        xmlMode: true
    });

    // add xmlns info
    $('questestinterop').attr('xmlns', 'http://www.imsglobal.org/xsd/ims_qtiasiv1p2').attr('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance').attr('xsi:schemaLocation', 'http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd');

    // explode pipe separated "or" responses
    $('conditionvar or').each(function(i, elem){
        var answers = '';
        $('varequal', this).each(function(i, elem){
            var that = $(this);
            var choices = that.text().split('|');
            _.each(choices, function(choice) {
                var ansNode = that.closest('varequal').clone();
                ansNode.text(choice);
                answers += $.xml(ansNode);
            });
        });
        $(this).empty();
        $(this).append(answers);
    });

    // add literal blanks in split mattext
    var fibs = $('presentation').filter(function(i, elem) {
        return $(this).attr('label' === 'FIB');
    });
    fibs.each(function(i, elem) {
        var quest = [];
        var mattext = $('mattext', this);
        mattext.each(function(i, elem) {
            quest.push($(this).text());
            if (i !== 0) {
                $(this).closest('material').remove();
            }
        });
        // pop the blank text at the end
        quest.pop();
        mattext.first().text(quest.join('____'));
    });

    console.log(pd.xml($.xml()));
});
