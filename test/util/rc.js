var expect = require('expect.js');
var helpers = require('../helpers');

describe('rc', function () {
  var tempDir = new helpers.TempDir();
  var tempDirBowerrc = new helpers.TempDir();

  var rc = require('../../lib/util/rc');

  tempDir.prepare({
    '.iotorrc': {
      key: 'value'
    },
    'child/.iotorrc': {
      key2: 'value2'
    },
    'child2/.iotorrc': {
      key: 'valueShouldBeOverwriteParent'
    },
    'child3/iotor.json': {
      name: 'without-iotorrc'
    },
    'other_dir/.iotorrc': {
      key: 'othervalue'
    }
  });

  tempDirBowerrc.prepare({
    '.iotorrc/foo': {
      key: 'bar'
    }

  });

  it('correctly reads .iotorrc files', function () {
    var config = rc('iotor', tempDir.path);

    expect(config.key).to.eql('value');
    expect(config.key2).to.eql(undefined);
  });

  it('correctly reads .iotorrc files from child', function () {
    var config = rc('iotor', tempDir.path + '/child/');

    expect(config.key).to.eql('value');
    expect(config.key2).to.eql('value2');
  });

  it('correctly reads .iotorrc files from child2', function () {
    var config = rc('iotor', tempDir.path + '/child2/');

    expect(config.key).to.eql('valueShouldBeOverwriteParent');
    expect(config.key2).to.eql(undefined);
  });

  it('correctly reads .iotorrc files from child3', function () {
    var config = rc('iotor', tempDir.path + '/child3/');

    expect(config.key).to.eql('value');
    expect(config.key2).to.eql(undefined);
  });

  it('loads the .iotorrc file from the cwd specified on the command line', function () {
    var argv = {
      'config': {
        'cwd': tempDir.path + '/other_dir/'
      }
    };

    var config = rc('iotor', tempDir.path, argv);

    expect(config.key).to.eql('othervalue');

  });

  it('throws an easy to understand error if .iotorrc is a dir', function () {
    // Gotta wrap this to catch the error
    var config = function () {
      rc('iotor', tempDirBowerrc.path);
    };

    expect(config).to.throwError(/should not be a directory/);
  });
});
